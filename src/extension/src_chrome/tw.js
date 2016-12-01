/* global chrome */
import $ from "jquery";
import hideContent from "../commons/logic";
import {twConfig} from "../commons/site_config/twConfig";

let globalSpoilersArr;
chrome.storage.local.get("spoilersArr", function(storage) {
	if (storage.spoilersArr !== undefined) {
		console.log("Received spoilersArr: " + JSON.stringify(storage.spoilersArr));
		globalSpoilersArr = storage.spoilersArr;
	}
	else {
		console.log("No spoilersArr in storage. Initialising to empty array");
		globalSpoilersArr =[];
	}
});

$(document).ready( function() {
	hideContent(globalSpoilersArr, twConfig);
});
