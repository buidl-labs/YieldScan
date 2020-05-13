import * as React from "react";
import { Range, getTrackBackground } from "react-range";
import { primaryColor, primaryColorHighlight } from "../../constants";

class RangeInput extends React.Component {
	constructor(props) {
		super(props);
		this.trackColor = mode => {
			return mode === "dark" ? "#3C475F" : "#EEF2F9";
		};
	}

	render() {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					flexWrap: "wrap"
				}}
			>
				<Range
					values={this.props.value}
					step={this.props.step}
					min={this.props.min}
					max={this.props.max}
					onChange={values => {
						this.props.callback(values);
					}}
					renderTrack={({ props, children }) => (
						<div
							onMouseDown={props.onMouseDown}
							onTouchStart={props.onTouchStart}
							style={{
								...props.style,
								height: "14px",
								display: "flex",
								width: "100%"
							}}
						>
							<div
								ref={props.ref}
								style={{
									height: "4px",
									width: "100%",
									borderRadius: "4px",
									background: getTrackBackground({
										values: this.props.value,
										colors:
											this.props.type === "range"
												? [
														this.trackColor(this.props.colorMode),
														primaryColor,
														this.trackColor(this.props.colorMode)
												  ]
												: [primaryColor, this.trackColor(this.props.colorMode)],
										min: this.props.min,
										max: this.props.max
									}),
									alignSelf: "center"
								}}
							>
								{children}
							</div>
						</div>
					)}
					renderThumb={({ props, isDragged }) => (
						<div
							{...props}
							style={{
								...props.style,
								height: isDragged ? "18px" : "14px",
								width: isDragged ? "18px" : "14px",
								borderRadius: "100%",
								backgroundColor: "#FFF",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								cursor: "pointer",
								boxShadow: isDragged
									? `0px 0px 0px 0.3rem ${primaryColorHighlight}`
									: "0px 1px 5px rgba(0,0,0,0.2)",
								outline: "none"
							}}
						></div>
					)}
				/>
			</div>
		);
	}
}

export default RangeInput;
