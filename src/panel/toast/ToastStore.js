import {Intent} from "@blueprintjs/core";
import {observable, computed} from "mobx";

class Store {
	@observable isAddSuccess = false;
	@observable isInvalidTitleOrTags = false;
	@observable isDuplicateTitle = false;
	@observable isInvalidId = false;
	@observable isMissingList = false;
	@observable isListDeleted = false;

	constructor() {}

	@computed get allFlags() {
		return [this.isAddSuccess, this.isInvalidTitleOrTags, this.isDuplicateTitle,
						this.isInvalidId, this.isMissingList, this.isListDeleted];
	}

	@computed get toastObject() {
		if (this.isAddSuccess) {
			return {
				message: "New list added. Refresh page to see changes.",
				intent: Intent.PRIMARY,
				timeout: 2000
			};
		}

		else if (this.isInvalidTitleOrTags) {
			return {
				message: "The entered title or tags are invalid.",
				intent: Intent.DANGER,
				timeout: 2000
			};
		}

		else if (this.isDuplicateTitle) {
			return {
				message: "A list with the same title already exists.",
				intent: Intent.DANGER,
				timeout: 2000
			};
		}

		else if (this.isInvalidId) {
			return {
				message: "The given ID is invalid.",
				intent: Intent.DANGER,
				timeout: 2000
			};
		}

		else if (this.isMissingList) {
			return {
				message: "The list could not be found.",
				intent: Intent.DANGER,
				timeout: 2000
			};
		}

		else if (this.isListDeleted) {
			return {
				message: "Deleted list. Refresh page to see changes.",
				intent: Intent.PRIMARY,
				timeout: 2000
			};
		}

		// Nothing to show
		else {
			return null;
		}
	}
}

const ToastStore = new Store();

export default ToastStore;
export { Store };
