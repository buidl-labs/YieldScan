import React from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Stage, Layer, Arc, Circle, Text } from "react-konva";
import Validators from "./Validators";
import { withRouter } from "react-router-dom";
import NomBottombar from "./NomBottombar";
import { IconButton, Spinner } from "@chakra-ui/core";

class NominatorApp extends React.Component {
	constructor() {
		super();
		this.latestBlockAuthor = undefined;
		this.state = {
			showValidatorAddress: false,
			copied: false,
			isLoaded: false
		};
		this.pathArray = window.location.href.split("/");
		this.ismounted = false;
		this.totalinfo = [];
		this.nominators = [];
	}

	componentDidMount() {
		this.deriveInfo();
	}

	componentWillUnmount() {
		this.ismounted = false;
	}

	deriveInfo = async () => {
		console.log("derive info running");
		const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io");
		const api = await ApiPromise.create({ provider: wsProvider });
		await api.isReady;
		const totalinfo = await Promise.all(
			this.props.valtotalinfo.map(
				async validator => await api.derive.staking.info(validator)
			)
		);
		let unfilteredNominators = [];
		totalinfo.forEach(ele => {
			ele.stakers.others.forEach(nom => {
				unfilteredNominators.push(nom.who);
			});
		});
		function onlyUnique(value, index, self) {
			return self.indexOf(value) === index;
		}
		let filteredNominators = unfilteredNominators.filter(onlyUnique);
		const nominators = await Promise.all(
			filteredNominators.map(async val => await api.derive.staking.info(val))
		);
		const parsedNominators = JSON.parse(JSON.stringify(nominators));
		if (!this.ismounted) {
			this.nominators = parsedNominators;
			this.totalinfo = totalinfo;
			this.setState({ isLoaded: true });
			this.ismounted = true;
		}
		console.log("api ready");
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
			state: { totalinfo: this.totalinfo, valinfo: this.props.valinfo }
		});
	};
	homebtnhandleClick = () => {
		document.body.style.cursor = "default";
		this.props.history.push({
			pathname: "/",
			state: { totalinfo: this.totalinfo, valinfo: this.props.valinfo }
		});
	};

	onCopy = () => {
		this.setState({ copied: true }, () =>
			setInterval(() => {
				this.setState({ copied: false });
			}, 3000)
		);
	};

	handlePolkavizClick = () => {
		document.body.style.cursor = "default";
		this.props.history.push({
			pathname: "/"
		});
	};

	render() {
		let arr1 = [];
		let bonded = 0;
		let valbacked = [];
		let totalbonded = 0;
		let stashId = "";
		let controllerId = "";
		console.log("rendered");
		if (
			this.props.history.location.pathname.split("/")[3] !== undefined &&
			this.state.isLoaded
		) {
			this.totalinfo.forEach(ele => {
				ele.stakers.others.forEach(nom => {
					if (
						nom.who.toString() ===
						this.props.history.location.pathname.split("/")[3].toString()
					) {
						arr1.push({
							validator: ele,
							staked:
								nom.value /
								(this.pathArray[4] === "kusama"
									? Math.pow(10, 12)
									: Math.pow(10, 15))
						});
						bonded +=
							nom.value /
							(this.pathArray[4] === "kusama"
								? Math.pow(10, 12)
								: Math.pow(10, 15));
					}
				});
			});

			let nominatorvalue = "";
			this.nominators.forEach(ele => {
				if (
					ele.accountId ===
					this.props.history.location.pathname.split("/")[3].toString()
				) {
					nominatorvalue = ele.controllerId;
					stashId = ele.stashId;
				}
			});
			valbacked = arr1;
			totalbonded = bonded;
			controllerId = nominatorvalue;
		}
		let nominatorname =
			this.props.history.location.pathname.split("/")[3] !== undefined
				? "Nominator Address: " +
				  this.props.history.location.pathname
						.split("/")[3]
						.toString()
						.slice(0, 8) +
				  "......" +
				  this.props.history.location.pathname
						.split("/")[3]
						.toString()
						.slice(-8)
				: "";

		let stashname =
			controllerId.toString().slice(0, 8) +
			"......" +
			controllerId.toString().slice(-8);

		let controllername = "controller: " + stashname;

		let bondvalue =
			"bonded: " +
			totalbonded.toString().slice(0, 5) +
			(this.pathArray[4] === "kusama" ? "KSM" : " DOT");

		let valtext =
			this.props.history.location.pathname.split("/")[3] !== undefined
				? this.props.history.location.pathname
						.split("/")[3]
						.toString()
						.slice(0, 8) +
				  "......" +
				  this.props.history.location.pathname
						.split("/")[3]
						.toString()
						.slice(-8)
				: "";

		let arr = valbacked;
		const width = window.innerWidth > 960 ? 960 : window.innerWidth;
		const height =
			window.innerWidth > 960
				? (window.innerHeight * 960) / window.innerWidth
				: window.innerHeight;
		if (this.state.isLoaded) {
			return (
				<React.Fragment>
					<div className="nav-path">
						<div className="nav-path-current">{nominatorname}</div>
						<IconButton
							ml={4}
							icon="copy"
							onClick={() => {
								navigator.clipboard
									.writeText(stashId)
									.then(this.onCopy, () => console.log(`Something went wrong`));
							}}
						/>
					</div>
					<Stage width={width} height={height}>
						<Layer>
							{this.state.copied && (
								<Text
									text="copied"
									x={1000}
									y={45}
									fill="green"
									fontSize={18}
								/>
							)}
							<Validators
								allvals={arr}
								rect_x={width / 2}
								circ_x={width / 2 - 200}
								circ_y={height / 2}
								totalinfo={this.totalinfo}
								history={this.props.history}
							/>
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

							<Circle
								x={width / 2 - 200}
								y={height / 2}
								radius={7}
								fill="white"
								onMouseOver={this.handleOnMouseOver}
								onMouseOut={this.handleOnMouseOut}
							/>

							{this.state.showValidatorAddress && (
								<Text
									text={valtext}
									x={width / 2 - 200}
									y={height / 2 - 18}
									fill="#FFFFFF"
								/>
							)}
						</Layer>
					</Stage>
					<div className="nombottombar">
						<NomBottombar
							controllername={controllername}
							bondvalue={bondvalue}
						/>
					</div>
				</React.Fragment>
			);
		} else {
			return <Spinner as="span" size="lg" alignSelf="center" mt={16} />;
		}
	}
}

export default withRouter(NominatorApp);
