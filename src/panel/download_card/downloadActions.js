import {action} from "mobx";
import MainStore from "../common/MainStore";
import ToastStore from "../toast/ToastStore";
import commonActions from "../common/commonActions";
import "whatwg-fetch";

// TODO: ES2015
module.exports = {
	saveDownloadList: action(saveDownloadList),
	hideDownloadCard: action(hideDownloadCard)
};

function saveDownloadList(title, id) {
	if (commonActions.isInvalidTitle(title) ||
		commonActions.isDuplicateTitle(title) ||
		commonActions.isInvalidId(id)) {

		return;
	}

	fetch("https://spoilerblocker.herokuapp.com/downloadList?id=" + id, {
		method: "get",
		credentials: "include"
	}).then(function(response) {
		return response.json();
	}).then(function(data) {
		if (data.Status !== "Success") {
			ToastStore.isMissingList = true;
			return;
		}

		const tagArr = commonActions.tagStringToArray(data.list.tags);

		if (commonActions.isInvalidTags(tagArr)) {
			// Ideally should never happen, as tags on website should be valid
			return;
		}

		commonActions.addNewList(title, tagArr);
		hideDownloadCard();
	});
}

function hideDownloadCard() {
	MainStore.isDownloadCardVisible = false;
}
