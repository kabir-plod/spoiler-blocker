jQuery(document).ready( function($) {
	console.log("START");

	var spoilersArr = ["the"];

	// Check for feed_stream's existence
	document.addEventListener("DOMNodeInserted", findFeed);

	// var contentObserver = new MutationSummary({
	// 	callback: contentObsCallback,
	// 	queries: [{
	// 		element: "div[id='stream_pagelet']"
	// 	}]
	// });

	// function contentObsCallback(summaries) {
	// 	console.log(summaries[0]);
	// }

	// Looks for the element with div id beginning with "feed_stream" and passes it to the mutation summary
	function findFeed() {
		var feed = $("div[id^='feed_stream']");

		// if no feed is found
		if ( feed.length === 0 ) {
			console.log("no streams");
		}

		// if the feed is found
		else {
			console.log("target ID is " + $(feed[0]).attr("id"));

			// look for new div elements
			var postObserver = new MutationSummary({
				callback: observeHyperFeed,
				rootNode: feed[0],
				queries: [{
					element: "div"
				}]
			});

			document.removeEventListener("DOMNodeInserted", findFeed);
			console.log("DOMNodeInserted listener removed");
		}
	}


	function observeHyperFeed(summaries) {
		// Filter all <div> elements with attr id beginning with hyperfeed
		// that have <p> elements as descendants
		// which contain any of the spoilers in spoilersArr.
		// Give these elements the "long-string-..." attribute.
		summaries[0].added.forEach( function(node) {
			elem = $(node).filter("[id^='hyperfeed_story']");

			if (elem.length > 0) {
				new MutationSummary({
					callback: hidePosts,
					rootNode: elem[0],
					queries: [{
						element: "div"
					}]
				})
			}
			// .has("p:contains('would')")
			// .attr("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
		});
	}

	function hidePosts(summaries) {
		elem = $(summaries[0].added).filter("[class^='userContentWrapper']");
		if (elem.length > 0) {
			postText = elem.text();
			toHide = false;
			for (var i=0; i<spoilersArr.length; i++) {
				// if tweet text contains a spoiler
				if (postText.indexOf( spoilersArr[i] ) > -1) {
					// tweetNode should be hidden
					toHide = true;
				}
			}

			if (toHide) {
				elem = $(elem[0]);
				console.log(elem.text());

				newDiv = $(document.createElement("div")).css({
					'position': 'absolute',
					'top': 0,
					'left': 0,
					'background-color': 'white',
					'width': '100%',
					'height': '99%',
					'z-index': 7,
					'cursor': 'pointer'
				});

				lineHeight = elem.height() * 0.9;

				// Spoiler text
				newDiv.append($('<p/>').text('Spoiler!').css({
					'position': 'absolute',
					'top': 0,
					'left': 0,
					'background-color': 'white',
					'width': '100%',
					'height': '100%',
					'font-size': 40,
					'text-align': 'center',
					'line-height': lineHeight.toString() + 'px',
					'font-family': 'Copperplate',
					'color': 'red',
					'margin': '0px'
				}));

				// Absolutely positioned element needs a positioned ancestor
				// This does not break any of twitter's formatting (far as I have seen)
				elem.css({
					'position': 'relative'
				})

				newDiv.click(function() {
					$(this).hide()
				});

				elem.append(newDiv);
			}
		}
	}


	// Return string output for jQuery selector to check if element with the
	// specified tag contains any of the text in stringArr.
	function containsAny(tag, stringArr) {
		var stringOutput = tag + ":contains('" + stringArr[0] + "')";

		for (var i=1; i<stringArr.length; i++) {
			stringOutput += ", " + tag + ":contains('" + stringArr[i] + "')";
		}

		console.log("string output " + stringOutput);
		return stringOutput;
	}
});