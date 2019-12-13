import React from "react";

class NomBottombar extends React.Component {
	render() {
		return (
			<React.Fragment>
				<div className="controllername">{this.props.controllername}</div>
				<div className="bondvalue">{this.props.bondvalue}</div>
			</React.Fragment>
		);
	}
}

export default NomBottombar;
