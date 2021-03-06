import React from "react";
const PropTypes = React.PropTypes;

// TODO: convert to blueprintjs react component if possible
const TitleBar = props => (
	<nav className="pt-navbar pt-dark pt-fixed-top">
	<div style={{margin: "0 auto"}}>
		<div className="pt-navbar-group pt-align-left">
			<div className="pt-navbar-heading">Spoiler Blocker</div>
		</div>
		<div className="pt-navbar-group pt-align-right">
			<button
				className="pt-button pt-minimal pt-icon-download"
				onClick={props.onDownloadList}>
					Download
			</button>
			<button
				className="pt-button pt-minimal pt-icon-add"
				onClick={props.onAddList}>
					Create
			</button>

			<span className="pt-navbar-divider"></span>

			<button 
				className="pt-button pt-minimal pt-icon-cog"
				onClick={props.onOptions}>
			</button>
		</div>
		</div>
	</nav>
);

TitleBar.propTypes = {
	onAddList: PropTypes.func.isRequired,
	onDownloadList: PropTypes.func.isRequired,
	onOptions: PropTypes.func.isRequired
};

export default TitleBar;
