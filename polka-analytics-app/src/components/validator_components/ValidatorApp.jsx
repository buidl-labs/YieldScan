import React from "react";
import { IconButton, Box, Text, Spinner, Flex } from "@chakra-ui/core";
import { Stage, Layer, Arc, Line, Rect } from "react-konva";
import { ApiPromise, WsProvider } from "@polkadot/api";
import WhiteCircles from "./WhiteCircles";
import { withRouter } from "react-router-dom";
import { hexToString } from "@polkadot/util";

class ValidatorApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			validator: props.history.location.pathname.split("/")[3].toString(),
			// validatorsandintentions: props.validatorsandintentions,
			nominators: [],
			showValidatorAddress: false,
			stash: "",
			controller: "",
			name: "",
			isloading: true,
			totalinfo: [],
			valinfo: {},
			validatorInfo: "",
			copied: false,
			isLoaded: false
		};
		this.pathArray = window.location.href.split("/");
		this.ismounted = false;
		this.totalvalue = 0;
		this.ownvalue = 0;
	}

	componentDidMount() {
		this.deriveInfo();
	}

	deriveInfo = async () => {
		const { validator } = this.state;
		const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io");
		const api = await ApiPromise.create({ provider: wsProvider });
		await api.isReady;

		let validatorInfo = undefined;
		let nominators = [];
		let name = "";
		name = await api.query.nicks.nameOf(validator);
		validatorInfo = this.props.electedInfo.info.find(
		  data => data.stashId.toString() === validator
		);
		nominators = await validatorInfo.stakers.others;
		// if (!this.props.validatorandintentionloading) {
		// 	const validatorList = this.props.validatorsandintentions
		// 		.toString()
		// 		.split(",");
		// 	if (validatorList.includes(validator)) {
		// 		validatorInfo = this.props.electedInfo.info.find(
		// 			data => data.stashId.toString() === validator
		// 		);
		// 		name = await api.query.nicks.nameOf(validator);
		// 		nominators = await validatorInfo.stakers.others;
		// 	}
		// }
		if (!this.ismounted) {
			this.setState(state => ({
				...state,
				validatorInfo: validatorInfo,
				nominators: nominators,
				name: name.raw[0]
					? hexToString(name.raw[0].toString())
					: `Validator (...${validator.slice(-6, -1)})`,
				isloading: false,
				isLoaded: true
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

	render() {
		const width = window.innerWidth;
		const height = window.innerHeight;
		let radius = 120;

		// let value = "";
		let validator = "";
		let valinfo = "";
		let totalinfo = "";
		// if (!this.props.validatorandintentionloading && !this.state.isloading) {
		// 	totalinfo = this.props.valtotalinfo;
		// 	this.totalvalue =
		// 		this.pathArray[4] === "kusama"
		// 			? this.state.validatorInfo.stakers.total / Math.pow(10, 12)
		// 			: this.state.validatorInfo.stakers.total / Math.pow(10, 15);
		// 	this.ownvalue =
		// 		this.pathArray[4] === "kusama"
		// 			? this.state.validatorInfo.stakers.own / Math.pow(10, 12)
		// 			: this.state.validatorInfo.stakers.own / Math.pow(10, 15);
		// 	validator = this.state.validatorInfo.accountId;
		// 	valinfo = value;
		// 	if (
		// 		this.props.intentions.includes(
		// 			this.props.history.location.pathname.split("/")[3].toString()
		// 		)
		// 	) {
		// 		this.totalvalue =
		// 			this.state.validatorInfo.stakingLedger.total / 10 ** 12;
		// 		this.ownvalue = this.state.validatorInfo.stakingLedger.total / 10 ** 12;
		// 	}
		// }

		let totalBonded = 0;
		totalBonded = this.totalvalue.toFixed(3) - this.ownvalue.toFixed(3);

		if (this.state.nominators.length > 10) {
			radius = 200;
		}
		let opacity = 0.3;
		let color = "#E50B7B";
		// if (this.props.intentions.includes(this.state.validator)) {
		// 	opacity = 0;
		// 	color = "yellow";
		// }
		if (this.state.isLoaded) {
			return (
				<React.Fragment>
					<Box textAlign="center">
						<Box display="flex" justifyContent="center" mt={20} mb={8}>
							<Text alignSelf="center">{this.state.name}</Text>
							<IconButton
								ml={4}
								icon="copy"
								onClick={() => {
									navigator.clipboard
										.writeText(validator)
										.then(this.onCopy, () =>
											console.log(`Something went wrong`)
										);
								}}
							/>
						</Box>
						<Text mt={8} color="brand.900" opacity={this.state.copied ? 1 : 0}>
							Copied to your clipboard
						</Text>
					</Box>
					<Stage width={width} height={height} draggable={true}>
						<Layer>
							{/* Here n is number of white circles to draw
		                	r is radius of the imaginary circle on which we have to draw white circles
		                	x,y is center of imaginary circle
		             	*/}

							<WhiteCircles
								colorMode={this.props.colorMode}
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
								stroke={
									this.props.colorMode === "light" ? "#CBD5E0" : "#718096"
								}
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
								fill={this.props.colorMode === "light" ? "#1A202C" : "#FFFFFF"}
								stroke={
									this.props.colorMode === "light" ? "#1A202C" : "#FFFFFF"
								}
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
					<Flex justifyContent="center">
						<Box
							mt={12}
							display="flex"
							justifyContent="space-between"
							width="100%"
							maxW="960px"
							alignSelf="center"
							mb={8}
						>
							<Text>Total Staked: {this.totalvalue.toFixed(3)} KSM</Text>
							<Text>
								Validator Self Stake: {this.ownvalue.toString().slice(0, 7)} KSM
							</Text>
							<Text>
								Nominator Stake: {totalBonded.toString().slice(0, 8)} KSM
							</Text>
						</Box>
					</Flex>
				</React.Fragment>
			);
		} else {
			return (
				<Box
					display="flex"
					flexDirection="column"
					position="absolute"
					top="50%"
					left="50%"
					transform="translate(-50%, -50%)"
					alignSelf="center"
					justifyContent="center"
					textAlign="center"
					mt={-16}
					zIndex={-1}
				>
					<Spinner as="span" size="lg" alignSelf="center" />
					<Text
						mt={4}
						fontSize="xl"
						color="gray.500"
						textAlign="center"
						alignSelf="center"
					>
						Stabilizing the isotopes...
					</Text>
				</Box>
			);
		}
	}
}

export default withRouter(ValidatorApp);
