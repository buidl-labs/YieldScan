import React from "react";
import { Circle, Line, Text, Rect } from "react-konva";

class Circleandline extends React.Component {
	constructor() {
		super();
		this.state = {
			showNominatorAddress: false
		};
		this.pathArray = window.location.href.split("/");
	}
	handleOnMouseOver = e => {
		e.target.setAttrs({
			scaleX: 1.3,
			scaleY: 1.3
		});
		document.body.style.cursor = "pointer";
		this.setState({ showNominatorAddress: true });
	};
	handleOnMouseOut = e => {
		e.target.setAttrs({
			scaleX: 1,
			scaleY: 1
		});
		document.body.style.cursor = "default";
		this.setState({ showNominatorAddress: false });
	};
	handleClick = () => {
		let pathArray = window.location.href.split("/");
		document.body.style.cursor = "default";
		this.props.history.push({
			pathname:
				pathArray[4] === "kusama"
					? "/kusama/nominator/" + this.props.text
					: "/alexander/nominator/" + this.props.text,
			state: { totalinfo: this.props.totalinfo, valinfo: this.props.valinfo }
		});
	};

	render() {
		// console.log(this.props.totalinfo)
		console.log("Circleandline", this.props.text);
		let nomaddress =
			"accountId: " +
			this.props.text.toString().slice(0, 8) +
			"......" +
			this.props.text.toString().slice(-8);

		let totalbonded =
			this.pathArray[4] === "kusama"
				? this.props.nombonded / Math.pow(10, 12)
				: this.props.nombonded / Math.pow(10, 15);
		let nombonded =
			"Bonded: " +
			totalbonded.toString().slice(0, 7) +
			(this.pathArray[4] === "kusama" ? " KSM" : " DOT");

		let x1 = (this.props.x - this.props.x2) * 1.4 + this.props.x2 - 260;
		let y1 = (this.props.y - this.props.y2) * 1.55 + this.props.y2 + -30;

		return (
			<React.Fragment>
				<Circle
					x={this.props.x}
					y={this.props.y}
					radius={7}
					fill="white"
					onMouseOver={this.handleOnMouseOver}
					onMouseOut={this.handleOnMouseOut}
					onClick={this.handleClick}
				/>
				<Line
					points={[this.props.x, this.props.y, this.props.x2, this.props.y2]}
					stroke="white"
					opacity={0.3}
				/>

				{this.state.showNominatorAddress && (
					<Rect
						x={x1}
						y={y1}
						width={260}
						height={50}
						cornerRadius={4.69457}
						fill="#333333"
						shadowOffsetY={10}
						shadowBlur={10}
						shadowColor="black"
						shadowOpacity={0.5}
					/>
				)}

				{this.state.showNominatorAddress && (
					<Text text={nomaddress} x={x1 + 20} y={y1 + 10} fill="#FFFFFF" />
				)}
				{this.state.showNominatorAddress && (
					<Text text={nombonded} x={x1 + 20} y={y1 + 30} fill="#FFFFFF" />
				)}
			</React.Fragment>
		);
	}
}
export default Circleandline;
