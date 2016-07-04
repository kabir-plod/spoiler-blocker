var spoilersObj = {};

chrome.storage.sync.get("allTags", function(allTags) {
	if (!chrome.runtime.error) {
		if (allTags.allTags != null) {
			spoilersObj = allTags.allTags;
		}
		else {
			spoilersObj = {};
		}
	}
	else {
		console.log("runtime error");
	}
});

var hidePref;
chrome.storage.sync.get("prefs", function(prefs) {
	hidePref = prefs["hide"];
	console.log("hide pref: " + hidePref);
});


domListenerRemoved = false;

// On page load
jQuery(document).ready(function($) {
	console.log("START");

	// Check for feed_stream's existence
	document.addEventListener("DOMNodeInserted", findFeed);

	// Timeout DOMNode listener after 10 seconds so non-newsfeed facbeook pages do not lag
	window.setTimeout(function() {
		if (domListenerRemoved === false) {
			document.removeEventListener("DOMNodeInserted", findFeed);
			console.log("Feed not found. DOMNodeInserted listener removed");
		}
	},
	10000)
});


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
		console.log("Feed found. DOMNodeInserted listener removed");
		domListenerRemoved = true;

		// Hide the posts that were loaded on document ready - mutation summary won't detect these
		hidePosts( $("div#substream_0") );
		hidePosts( $("div#substream_1") );
	}
}


function observeHyperFeed(summaries) {
	// Filter all <div> elements with attr id beginning with userContentWrapper
	summaries[0].added.forEach( function(node) {
		$elem = $(node).filter("[class^='userContentWrapper']");
		// if the element is not a nested content wrapper
		if ($elem.parent().closest("[class^='userContentWrapper']").length === 0) {
			hidePosts($elem);
		}
	});
}


function hidePosts(elem) {
	var listTitle = null;
	if (elem.length > 0) {
		postText = elem.text();
		console.log(postText);

		for (var title in spoilersObj) {
			if (!spoilersObj.hasOwnProperty(title)) {
				// Not actually a list
				continue;
			}
			if (!spoilersObj[title].active) {
				// List is not active
				continue;
			}

			// if tweet text contains a spoiler
			for (var j = 0; j < spoilersObj[title].tags.length; j++) {
				if (postText.indexOf(spoilersObj[title].tags[j]) > -1) {
					// tweetNode should be hidden
					if (hidePref === "remove") {
						$(elem).remove();
					}
					else if (hidePref === "overlay") {
						overlay(elem, title);
					}
					else {
						console.log("Error in loading hide preference. Found " + hidePref + " instead of 'overlay' or 'remove'. Defaulting to overlay");
						overlay(elem, title);
					}
					break;
				}
			}
		}
	}
}


function overlay(elem, listTitle) {
	elem = $(elem[0]);

	var hgt = '100%';

	newDiv = $(document.createElement("div")).css({
		'position': 'absolute',
		'top': 0,
		'left': 0,
		'background-color': 'white',
		'display': 'flex',
		'justify-content': 'center',
		'align-items': 'center',
		'text-align': 'center',
		'width': '100%',
		'height': hgt,
		'z-index': 7,
		'cursor': 'pointer',
		'font-size': 30,
		'font-family': 'Copperplate',
		'color': 'red'
	});

	newDiv.html('Spoiler!<br><br>Title: ' + listTitle);

	// Absolutely positioned element needs a positioned ancestor
	// This does not break formatting (far as I have seen)
	elem.css({
		'position': 'relative'
	});

	newDiv.click(function() {
		$(this).hide()
	});

	elem.append(newDiv);
}
