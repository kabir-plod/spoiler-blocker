import React from "react";
const PropTypes = React.PropTypes;
import {observer} from "mobx-react";
import {Popover, Position, Button, EditableText, Collapse} from "@blueprintjs/core";
import OptionsMenuContainer from "../options_menu/OptionsMenuContainer";
import MainStore from "../MainStore";

// TODO: extract smaller components
const SpoilerCard = observer(props => 
	<div className="pt-card" 
		style={{position: "relative",
				backgroundColor: "#F5F8FA",
				color: props.isActive ? "#000000" : "#5C7080",
				borderLeft: props.isActive ? "8px solid #29A634" : "8px solid #738694",
				marginBottom: props.marginBottom}}>
		{/* TODO: make editable */}
		<div>
			{props.title + (props.isActive ? "" : " (Inactive)")}
		</div>
		<div className="pt-navbar-group" style={{position: "absolute", top: 0, right: 0, paddingRight:10}}>

			<Popover 
				content={
					<OptionsMenuContainer index={props.index} />
				}
				inline={true}
				position={Position.LEFT_TOP}
				onClick={props.onOptionsMenuClick}>

				<Button className={"pt-minimal pt-icon-more"} />

			</Popover>

			{props.isExpanded ? 
				<Button className="pt-minimal pt-icon-chevron-down" onClick={props.onExpandCollapse} />
				: 
				<Button className="pt-minimal pt-icon-chevron-right" onClick={props.onExpandCollapse} />
			}
		</div>
		<Collapse isOpen={props.isExpanded}>
			<br />
			<EditableText value={props.tags} onChange={props.onUpdateTags} onConfirm={props.onSave} />
		</Collapse>
	</div>
);

SpoilerCard.propTypes = {
	onExpandCollapse: PropTypes.func.isRequired,
	isExpanded: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	isActive: PropTypes.bool.isRequired,
	tags: PropTypes.string.isRequired,
	onUpdateTags: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	marginBottom: PropTypes.number.isRequired
};

export default SpoilerCard;