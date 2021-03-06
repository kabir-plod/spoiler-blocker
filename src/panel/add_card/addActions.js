import {action} from "mobx";
import MainStore from "../common/MainStore";
import OptionStore from "../common/OptionStore";
import ToastStore from "../toast/ToastStore";
import commonActions from "../common/commonActions";

// TODO: ES2015
module.exports = {
	saveAddList: action(saveAddList),
	hideAddCard: action(hideAddCard)
};

function saveAddList(title, tagString) {
	const tagArr = commonActions.tagStringToArray(tagString);
	commonActions.addNewList(title, tagArr);

	hideAddCard();
}

function hideAddCard() {
	MainStore.isAddCardVisible = false;
}
