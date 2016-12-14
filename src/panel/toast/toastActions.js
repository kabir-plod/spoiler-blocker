import {action} from "mobx";
import ToastStore from "./ToastStore";

module.exports = {
	resetToastObject: action(resetToastObject)
};

function resetToastObject() {
	ToastStore.isAddSuccess = false;
	ToastStore.isInvalidTitleOrTags = false;
	ToastStore.isDuplicateTitle = false;
	ToastStore.isInvalidId = false;
	ToastStore.isMissingList = false;
	ToastStore.isListDeleted = false;
}
