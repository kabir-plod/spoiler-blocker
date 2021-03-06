import React from "react";
import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import OptionStore from "../panel/common/OptionStore";
import optionsActions from "./optionsActions";
import {FocusStyleManager} from "@blueprintjs/core";
import {Switch} from "@blueprintjs/core";
import DevTools from "mobx-react-devtools";


FocusStyleManager.onlyShowFocusOnTabs();

@observer
class App extends React.Component {
	constructor(props) {
		super(props);
	}

	handleToggleCaseSensitivity() {
		optionsActions.toggleCaseSensitivity();
	}

	handleToggleHidePref() {
		optionsActions.toggleHidePref();
	}

	render() {
		return (

			<div>
				{process.env.NODE_ENV === "production" ? null : <DevTools />}
				<h3>{"Default preferences"}</h3>
				{"New lists created will have the following default preferences."}
				<br /><br/>

				{console.log("def cs: " + OptionStore.prefs.defaultCaseSensitivity)}
				{console.log("def hp: " + OptionStore.prefs.defaultHidePref)}

				<Switch
					label="Case sensitive"
					checked={OptionStore.prefs.defaultCaseSensitivity}
					onChange={this.handleToggleCaseSensitivity}
				/>
				<Switch
					label="Overlay/remove" // TODO: clearer label
					checked={OptionStore.prefs.defaultHidePref === "remove"}
					onChange={this.handleToggleHidePref}
				/>
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById("app")
);