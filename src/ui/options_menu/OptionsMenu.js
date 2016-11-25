import React from "react";
const PropTypes = React.PropTypes;
import {observer} from "mobx-react";
import {Menu, MenuItem, MenuDivider, Switch} from "@blueprintjs/core";

const OptionsMenu = observer(props => 
	<Menu>
		<Switch 
			label="Case sensitive"
			checked={props.isCaseSensitive}
			onChange={props.onToggleCaseSensitivity}
		/>
		<MenuItem
			iconName="new-object"
			// onClick={this.handleClick}
			text="New object" 
		/>
		<MenuItem
			iconName="new-link"
			// onClick={this.handleClick}
			text="New link"
		/>
		<MenuDivider />
		<MenuItem 
			iconName="trash"
			text="Delete" 
		/>
	</Menu>
);

OptionsMenu.propTypes = {
	isCaseSensitive: PropTypes.bool.isRequired,
	onToggleCaseSensitivity: PropTypes.func.isRequired
};

export default OptionsMenu;