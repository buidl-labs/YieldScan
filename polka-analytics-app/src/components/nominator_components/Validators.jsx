import React from "react";
import Rectangleandlines from "./Rectangleandlines";

class Validators extends React.Component {
	render() {
		let arr1 = [];
		let initial_Y = window.innerHeight / 3;
		let windowlength = window.innerHeight / 3;
		if (this.props.allvals.length > 10) {
			initial_Y = window.innerHeight / 4;
			windowlength = window.innerHeight / 2;
		}

		let y_cord = initial_Y;
		let width = window.innerWidth;
		let height = window.innerHeight;
		let rad = height / 2 - 24;
		this.props.allvals.forEach((element, index) => {
			// console.log(element)
			y_cord += windowlength / (this.props.allvals.length + 1);
			arr1.push(
				<Rectangleandlines
					colorMode={this.props.colorMode}
					key={index}
					validatorTableData={this.props.validatorTableData}
					totalinfo={this.props.totalinfo}
					valinfo={element.validator}
					staked={element.staked}
					history={this.props.history}
					x={this.props.rect_x}
					y={y_cord}
					circ_x={this.props.circ_x}
					circ_y={this.props.circ_y}
					xline={
						width - 2 - Math.sqrt(rad * rad - Math.pow(y_cord - height / 2, 2))
					}
				/>
			);
		});
		return arr1;
	}
}

export default Validators;
