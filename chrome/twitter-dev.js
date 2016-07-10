/* global chrome, Promise, MutationSummary */

var spoilersObj = {};
var hidePref;

// Promise for async get tags
var p1 = new Promise(function(resolve, reject) {
	// Get list of tags from persistent storage
	chrome.storage.sync.get("allTags", function(allTags) {
		if (!chrome.runtime.error) {
			resolve(allTags);
		}
		else {
			reject("runtime error");
		}
	});
});


// Get user preferences
chrome.storage.sync.get("prefs", function(prefs) {
	hidePref = prefs["hide"];
	console.log("hide pref: " + hidePref);
});


// Hide page until alltags object is retrieved
document.documentElement.style.visibility = 'hidden';

// Call rest of code when document is ready and promise has been fulfilled
jQuery(document).ready( function($) {
	p1.then( function(allTags) {
		if (allTags.allTags != null) {
			spoilersObj = allTags.allTags;
		}
		else {
			spoilersObj = {};
		}

		console.log("START");
		findStream();
		observeBody();
	});
});


// Hide all tweets that were loaded when documentready fired
function findStream() {
	var target = $(".stream");

	if (target.length > 0) {
		// Get all tweets loaded on document ready
		var loadedTweets = $("li[data-item-type]").toArray();
		for (var i=0; i<loadedTweets.length; i++) {
			hideTweet(loadedTweets[i]);
		}

		// All tweets on page have been checked, make document visible
		document.documentElement.style.visibility = '';

		// Get tweets loaded on scroll
		var tweetObs = new MutationSummary({
			callback: newTweetsCallback,
			rootNode: target[0],
			queries: [{
				element: "li[data-item-type]"
			}]
		});
	}
}


// Set mutationobserver on <body> element. Changes to its class attribute
// indicate new twitter webpage has been loaded
function observeBody() {
	// Look for feed
	var bodyObserver = new MutationObserver( function(mutationRecord) {
		mutationRecord.forEach( function() {
			console.log("finding stream");
			findStream();
		});
	});

	// trigger callback if body class changes
	bodyObserver.observe($("body")[0], {
		attributeFilter: ["class"]
	});
}


// Callback for mutationsummary that finds tweets added after domcontentloaded event
function newTweetsCallback(summaries) {
	summaries[0].added.forEach( function(node) {
		hideTweet(node);
	});
}


// Hides tweets by overlaying or removing them, if text contains a case-sensitive keyword
// listed in the global spoilers object (only active lists)
function hideTweet(elem) {
	var $elem = $(elem);

	// Adblocker was hiding 'tweets', but program was detecting spoilers within
	// These 'tweets' had very small heights, so this weeds those out
	if ($elem.height() <= 2) return;

	var tweetText = $elem.find("p").text();
	// console.log(tweetText);

	for (var title in spoilersObj) {
		if (!spoilersObj.hasOwnProperty(title) || !spoilersObj[title]["active"]) {
			// Not actually a list or list is inactive
			continue;
		}

		for (var j=0; j<spoilersObj[title]["tags"].length; j++) {
			// if tweet text contains a spoiler
			if (tweetText.indexOf(spoilersObj[title]["tags"][j]) > -1) {
				// hide tweet
				if (hidePref === "remove") {
					$($elem).remove();
				}
				else if (hidePref === "overlay") {
					overlay($elem, title);
				}
				else {
					console.log("Error in loading hide preference. Found " +
							hidePref + " instead of 'overlay' or 'remove'. Defaulting to overlay");
						overlay($elem, title);
				}
				break;
			}
		}
	}
}


// Adds a white, 97.5% opaque div on top of a given elem
function overlay($elem, listTitle) {
	// Add overlay only once
	if ($elem.children().hasClass("spoiler-overlay") === true) {
		return;
	}

	var hgt = '99%';

	var $newDiv = $(document.createElement("div")).css({
		'position': 'absolute',
		'top': 0,
		'left': 0,
		'background-color': 'white',
		'opacity': 0.975,
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

	$newDiv.html('Spoiler!<br><br>Title: ' + listTitle);

	$newDiv.addClass("spoiler-overlay");

	// Absolutely positioned element needs a positioned ancestor
	$elem.css({
		'position': 'relative'
	});

	$newDiv.click(function() {
		$(this).hide()
	});

	$elem.append($newDiv);
}
