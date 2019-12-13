import React from "react";
import { IconButton } from "@chakra-ui/core";
import { Stage, Layer, Arc, Line, Rect, Text } from "react-konva";
import { ApiPromise, WsProvider } from "@polkadot/api";
import WhiteCircles from "./WhiteCircles";
import { withRouter } from "react-router-dom";
import ValBottombar from "./ValBottombar";

class ValidatorApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			validator: props.history.location.pathname.split("/")[3].toString(),
			validatorsandintentions: props.validatorsandintentions,
			nominators: [],
			showValidatorAddress: false,
			stash: "",
			controller: "",
			isloading: true,
			totalinfo: [],
			valinfo: {},
			validatorInfo: "",
			copied: false
		};
		this.pathArray = window.location.href.split("/");
		this.ismounted = false;
		this.totalvalue = 0;
		this.ownvalue = 0;
	}

	componentDidMount() {
		this.deriveInfo();
	}
	// shouldComponentUpdate(nextProps, nextState) {
	// 	if (
	// 		this.props.validatorandintentionloading ===
	// 			nextProps.validatorandintentionloading &&
	// 		this.props.validatorsandintentions ===
	// 			nextProps.validatorsandintentions &&
	// 		this.state.copied === nextState.copied
	// 	) {
	// 		return false;
	// 	} else {
	// 		return true;
	// 	}
	// }

	deriveInfo = async () => {
		const { validator } = this.state;
		const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io");
		const api = await ApiPromise.create({ provider: wsProvider });
		await api.isReady;

		let validatorInfo = undefined;
		let nominators = [];
		console.log(`loading: ${this.props.validatorandintentionloading}`);
		if (!this.props.validatorandintentionloading) {
			const logger = this.props.validatorsandintentions.toString().split(",");
			console.log("found", logger);
			if (logger.includes(validator)) {
				validatorInfo = await api.derive.staking.info(validator);
				nominators = await validatorInfo.stakers.others;
			}
		}
		if (!this.ismounted) {
			this.setState(state => ({
				...state,
				validatorInfo: validatorInfo,
				nominators: nominators,
				isloading: false
			}));
		}
		this.ismounted = true;
	};

	handleOnMouseOver = () => {
		this.setState({ showValidatorAddress: true });
	};
	handleOnMouseOut = () => {
		this.setState({ showValidatorAddress: false });
	};

	BackbtnhandleOnMouseOver = () => {
		document.body.style.cursor = "pointer";
	};
	BackbtnhandleOnMouseOut = () => {
		document.body.style.cursor = "default";
	};

	BackbtnhandleClick = () => {
		document.body.style.cursor = "default";
		this.props.history.push({
			pathname: this.pathArray[4] === "kusama" ? "/kusama" : "/alexander",
			state: { totalinfo: this.props.totalinfo, valinfo: this.props.valinfo }
		});
	};
	homebtnhandleClick = () => {
		document.body.style.cursor = "default";
		this.props.history.push({
			pathname: "/",
			state: { totalinfo: this.props.totalinfo, valinfo: this.props.valinfo }
		});
	};
	onCopy = () => {
		if (this.ismounted) {
			this.setState({ copied: true }, () => {
				console.log("copied state set");
				setInterval(() => {
					this.setState({ copied: false });
				}, 3000);
			});
		}
	};

	componentWillUnmount() {
		this.ismounted = false;
	}
	render() {
		const width = window.innerWidth > 960 ? 960 : window.innerWidth;
		const height =
			window.innerWidth > 960
				? (window.innerHeight * 960) / window.innerWidth
				: window.innerHeight;
		let radius = 120;

		let value = "";
		let validator = "";
		let valinfo = "";
		let totalinfo = "";
		if (!this.props.validatorandintentionloading && !this.state.isloading) {
			totalinfo = this.props.valtotalinfo;
			this.totalvalue =
				this.pathArray[4] === "kusama"
					? this.state.validatorInfo.stakers.total / Math.pow(10, 12)
					: this.state.validatorInfo.stakers.total / Math.pow(10, 15);
			console.log("totalvalue: ", this.totalvalue);
			this.ownvalue =
				this.pathArray[4] === "kusama"
					? this.state.validatorInfo.stakers.own / Math.pow(10, 12)
					: this.state.validatorInfo.stakers.own / Math.pow(10, 15);
			validator = this.state.validatorInfo.accountId;
			valinfo = value;
			if (
				this.props.intentions.includes(
					this.props.history.location.pathname.split("/")[3].toString()
				)
			) {
				this.totalvalue =
					this.state.validatorInfo.stakingLedger.total / 10 ** 12;
				this.ownvalue = this.state.validatorInfo.stakingLedger.total / 10 ** 12;
			}
		}

		let validatorname =
			"Validator Address: " +
			this.state.validator.toString().slice(0, 8) +
			"......" +
			this.state.validator.toString().slice(-8);

		let totalbondedtext =
			"total staked: " +
			this.totalvalue.toFixed(3) +
			(this.pathArray[4] === "kusama" ? " KSM" : " DOT");
		let selfbondedtext =
			"validator self stake: " +
			this.ownvalue.toString().slice(0, 7) +
			(this.pathArray[4] === "kusama" ? " KSM" : " DOT");

		let totalbonded = 0;
		totalbonded = this.totalvalue.toFixed(3) - this.ownvalue.toFixed(3);
		let nominatorbondedtext =
			"nominator stake: " +
			totalbonded.toString().slice(0, 8) +
			(this.pathArray[4] === "kusama" ? " KSM" : " DOT");
		if (this.state.nominators.length > 10) {
			radius = 200;
		}
		let opacity = 0.3;
		let color = "purple";
		if (this.props.intentions.includes(this.state.validator)) {
			opacity = 0;
			color = "yellow";
		}
		return (
			<React.Fragment>
				<div className="nav-path">
					<div className="nav-path-current">{validatorname}</div>
					<IconButton
						ml={4}
						icon="copy"
						onClick={() => {
							navigator.clipboard
								.writeText(validator)
								.then(this.onCopy, () => console.log(`Something went wrong`));
						}}
					/>
				</div>
				<Stage width={width} height={height} draggable={true}>
					<Layer>
						{this.state.copied && (
							<Text text="copied" x={1000} y={45} fill="green" fontSize={18} />
						)}
						{/* Here n is number of white circles to draw
		                	r is radius of the imaginary circle on which we have to draw white circles
		                	x,y is center of imaginary circle
		             	*/}

						<WhiteCircles
							n={this.state.nominators.length}
							r={radius}
							x={width / 2 + 13}
							y={height / 2 + 6}
							nominators={this.state.nominators}
							history={this.props.history}
							totalinfo={totalinfo}
							valinfo={valinfo}
						/>

						{/* Arc used to create the semicircle on the right,
		            		Rotation is used to rotate the arc drawn by 90 degrees in clockwise direction
		       			*/}
						<Arc
							x={width - 2}
							y={height / 2}
							innerRadius={height / 2 - 25}
							outerRadius={height / 2 - 24}
							rotation={90}
							angle={180}
							stroke="#97A1BF"
							strokeWidth={4}
						/>
						{/* Adding 6 to stating and ending y point and 24 to length of line
		            		because the upper left corner of rectangle is at width/2,height/2
		            		so mid point of rectangle becomes width/2+12,height/2+6
		         		*/}
						<Line
							points={[
								width / 2,
								height / 2 + 6,
								width - height / 2 + 23,
								height / 2 + 6
							]}
							fill="white"
							stroke="white"
							opacity={opacity}
						/>

						<Rect
							x={width / 2}
							y={height / 2}
							width={26}
							height={12}
							fill={color}
							cornerRadius={10}
							onMouseOver={this.handleOnMouseOver}
							onMouseOut={this.handleOnMouseOut}
						/>
					</Layer>
				</Stage>
				<div className="valbottombar">
					<ValBottombar
						totalbondedtext={totalbondedtext}
						selfbondedtext={selfbondedtext}
						nominatorbondedtext={nominatorbondedtext}
					/>
				</div>
			</React.Fragment>
		);
	}
}

export default withRouter(ValidatorApp);
