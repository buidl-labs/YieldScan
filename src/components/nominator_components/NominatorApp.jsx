import React from 'react';
// import { ApiPromise, WsProvider } from '@polkadot/api';
import {
  Stage,
  Layer,
  Arc,
  Circle,
  Text as KonvaText,
  Rect
} from 'react-konva';
import Validators from './Validators';
import { withRouter } from 'react-router-dom';
import { Spinner, Box, Text, Flex, Grid, Divider } from '@chakra-ui/core';
import { Helmet } from 'react-helmet';
import LogEvent from '../LogEvent';
import axios from 'axios';
import ErrorMessage from '../ErrorMessage';

class NominatorApp extends React.Component {
  constructor() {
    super();
    this.latestBlockAuthor = undefined;
    this.state = {
      showValidatorAddress: false,
      copied: false,
      isLoaded: false,
      validators: [],
      totalStaked: 0,
      highestStaked: 0,
      othersStaked: 0,
      expectedDailyRoi: 0,
      backers: 0,
      nominatorId: '',
      errorState: false,
      name: ''
    };
    this.pathArray = window.location.href.split('/');
    this.ismounted = false;
    this.totalinfo = [];
    this.nominators = [];
    this.totalValidators = [];
    this.totalStake = 0;
    this.validatorWithHighestStake = 0;
    this.earningInPreviousEra = 0;
    this.expectedDailyRoi = 0;
  }

  componentDidMount() {
    const id = this.props.history.location.pathname.split('/')[3].toString();
    axios
      .get(`https://evening-sea-52088.herokuapp.com/nominatorinfo/${id}`)
      .then(({ data: currentNominator }) => {
        const nominatorId = currentNominator.nominatorId;
        this.setState({
          nominatorId: `${nominatorId.slice(0, 8)}.....${nominatorId.slice(
            -8
          )}`,
          name: `Nominator(...${nominatorId.slice(-5)})`,
          validators: currentNominator.validators,
          totalStaked: currentNominator.totalStaked,
          highestStaked: currentNominator.highestStaked,
          othersStaked: currentNominator.othersStaked,
          expectedDailyRoi: currentNominator.expectedDailyRoi,
          backers: currentNominator.backers,
          isLoaded: true
        });
      })
      .catch(err => {
        this.setState({
          errorState: true
        });
      });
  }

  // deriveInfo = async () => {
  // 	console.log("derive info running");
  // 	const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io");
  // 	const api = await ApiPromise.create({ provider: wsProvider });
  // 	await api.isReady;
  // 	const totalinfo = await Promise.all(
  // 		this.props.valtotalinfo.map(
  // 			async validator => await api.derive.staking.account(validator)
  // 		)
  // 	);
  // 	console.log("totalinfo", totalinfo);
  // 	let unfilteredNominators = [];
  // 	totalinfo.forEach(ele => {
  // 		ele.stakers.others.forEach(nom => {
  // 			unfilteredNominators.push(nom.who);
  // 		});
  // 	});
  // 	console.log("unfilteredNominators", unfilteredNominators);

  // 	function onlyUnique(value, index, self) {
  // 		return self.indexOf(value) === index;
  // 	}
  // 	let filteredNominators = unfilteredNominators.filter(onlyUnique);
  // 	console.log("filteredNominators", filteredNominators);
  // 	const nominators = await Promise.all(
  // 		filteredNominators.map(async val => await api.derive.staking.account(val))
  // 	);
  // 	const parsedNominators = JSON.parse(JSON.stringify(nominators));
  // 	console.log("parsedNominators", parsedNominators);
  // 	// const nominatorId = this.props.history.location.pathname.split("/")[3].toString();
  // 	// let totalBalance = await api.query.balances.freeBalance(nominatorId);
  // 	// // Here we subscribe to any balance changes and update the on-screen value
  // 	// api.query.balances.freeBalance(nominatorId, (current) => {
  // 	// 	// Calculate the delta
  // 	// 	const change = current.sub(totalBalance);

  // 	// 	// Only display positive value changes (Since we are pulling `previous` above already,
  // 	// 	// the initial balance change will also be zero)
  // 	// 	if (!change.isZero()) {
  // 	// 	  this.earningInPreviousEra = (JSON.parse(JSON.stringify(change)) / 10 ** 12).toFixed(3);
  // 	// 	}
  // 	//   });
  // 	console.log("yoyo", totalinfo);
  // 	if (!this.ismounted) {
  // 		this.nominators = parsedNominators;
  // 		this.totalinfo = totalinfo;
  // 		this.setState({ isLoaded: true });
  // 		this.ismounted = true;
  // 	}
  // 	console.log("api ready");
  // };

  handleOnMouseOver = () => {
    this.setState({ showValidatorAddress: true });
  };
  handleOnMouseOut = () => {
    this.setState({ showValidatorAddress: false });
  };

  BackbtnhandleOnMouseOver = () => {
    document.body.style.cursor = 'pointer';
  };
  BackbtnhandleOnMouseOut = () => {
    document.body.style.cursor = 'default';
  };

  BackbtnhandleClick = () => {
    document.body.style.cursor = 'default';
    this.props.history.push({
      pathname: this.pathArray[4] === 'kusama' ? '/kusama' : '/alexander',
      state: { totalinfo: this.totalinfo, valinfo: this.props.valinfo }
    });
  };
  homebtnhandleClick = () => {
    document.body.style.cursor = 'default';
    this.props.history.push({
      pathname: '/',
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
    document.body.style.cursor = 'default';
    this.props.history.push({
      pathname: '/'
    });
  };

  render() {
    let valbacked = [];
    console.log('rendered');
    // if (
    // 	this.props.history.location.pathname.split("/")[3] !== undefined &&
    // 	this.state.isLoaded
    // ) {
    // 	this.totalinfo.forEach(ele => {
    // 		ele.stakers.others.forEach(nom => {
    // 			if (
    // 				nom.who.toString() ===
    // 				this.props.history.location.pathname.split("/")[3].toString()
    // 			) {
    // 				arr1.push({
    // 					validator: ele,
    // 					staked:
    // 						nom.value /
    // 						(this.pathArray[4] === "kusama"
    // 							? Math.pow(10, 12)
    // 							: Math.pow(10, 15))
    // 				});
    // 				bonded +=
    // 					nom.value /
    // 					(this.pathArray[4] === "kusama"
    // 						? Math.pow(10, 12)
    // 						: Math.pow(10, 15));
    // 			}
    // 		});
    // 	});

    // 	let nominatorvalue = "";
    // 	this.nominators.forEach(ele => {
    // 		if (
    // 			ele.accountId ===
    // 			this.props.history.location.pathname.split("/")[3].toString()
    // 		) {
    // 			nominatorvalue = ele.controllerId;
    // 			stashId = ele.stashId;
    // 		}
    // 	});
    // 	valbacked = arr1;
    // 	console.log("Validators Backed", JSON.parse(JSON.stringify(arr1)));
    // 	totalbonded = bonded;
    // 	console.log("totalbonded", totalbonded);
    // 	controllerId = nominatorvalue;
    // 	this.totalValidators = valbacked;
    // 	this.totalStake = totalbonded;
    // 	this.validatorWithHighestStake = Math.max(...valbacked.map(validator => validator.staked));

    // 	const parsedBackers = JSON.parse(JSON.stringify(valbacked));
    // 	//Get Stash id for all the validators backed by current nominator
    // 	const ids = parsedBackers.map(val => val.validator.stashId);
    // 	const result = this.props.validatorData.filter(validator => {
    // 		return ids.includes(validator.stashId);
    // 	});

    // 	let sum = 0;
    // 	for(let i = 0; i < parsedBackers.length; i++){
    // 		//Logic for calculating expected daily ROI
    // 		const { staked } = parsedBackers[i];
    // 		const {totalStake, poolReward} = result[i];
    // 		sum += (staked / totalStake) * poolReward;
    // 	}

    // 	this.expectedDailyRoi = (sum * ERA_PER_DAY).toFixed(3);
    // }

    if (this.state.errorState) {
      return <ErrorMessage />;
    }

    let arr = valbacked;
    const width = window.innerWidth - 420;
    const height = window.innerHeight - 183;
    console.log('state', this.state);
    if (this.state.isLoaded) {
      return (
        <React.Fragment>
          <Helmet>
            <title>Specific View - {this.state.name} - Polka Analytics</title>
            <meta name="description" content="Nominator key stats" />
          </Helmet>
          <LogEvent eventType="Nominator view" />
          <Box textAlign="center">
            <Box display="flex" justifyContent="center">
              <Text fontSize="3xl" alignSelf="center">
                {this.state.name}
              </Text>
            </Box>
            {/* <Text mt={8} color="brand.900" opacity={this.state.copied ? 1 : 0}>
							Copied to your clipboard
						</Text> */}
          </Box>
          <Grid templateColumns="1fr 2fr" gap={2}>
            <Box
              width={350}
              height={540}
              style={{
                marginLeft: 40,
                marginTop: 40,
                boxShadow:
                  '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
                borderRadius: '10px',
                padding: '5px 10px'
              }}
            >
              <Flex flexDirection="column" alignItems="center">
                <Text
                  align="center"
                  mt={2}
                  fontSize="2xl"
                  fontWeight="semibold"
                  lineHeight="short"
                >
                  Key Stats
                </Text>
              </Flex>
              {/* <Divider /> */}
              {/* <Flex flexDirection="column" style={{ padding: "0 20px" }}>
								<Text mt={2} fontSize="md" fontWeight="bold" lineHeight="short">
									Earning in previous era
								</Text>
								<Text>
									<span
										style={{
											textTransform: "uppercase",
											fontWeight: "bold",
											color: "#E50B7B"
										}}
									>
										{this.earningInPreviousEra} KSM
									</span>
								</Text>
							</Flex> */}
              <Divider />
              <Flex flexDirection="column" style={{ padding: '0 20px' }}>
                <Text fontWeight="bold">Expected daily earning</Text>
                <Text
                  style={{
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    color: '#E50B7B'
                  }}
                >
                  {this.state.expectedDailyRoi} KSM
                </Text>
              </Flex>
              <Divider />
              <Flex flexDirection="column" style={{ padding: '0 20px' }}>
                <Text fontWeight="bold">Diversity</Text>
                <Text>
                  Backing {this.state.backers}{' '}
                  {this.state.backers > 1
                    ? 'different validators'
                    : 'validator'}
                </Text>
              </Flex>
              <Divider />
              <Flex flexDirection="column" style={{ padding: '0 20px' }}>
                <Text fontWeight="bold">Amount at stake</Text>
                <Text mt={3} fontSize="12px">
                  Total
                </Text>
                <Text style={{ color: '#E50B7B', fontWeight: 'bold' }}>
                  {this.state.totalStaked} KSM
                </Text>
                <Text mt={3} fontSize="12px">
                  On highest
                </Text>
                <Text fontWeight="bold">{this.state.highestStaked} KSM</Text>
                <Text style={{ color: '#718096', fontSize: 12 }}>
                  Highest amount staked on this validator
                </Text>
                <Text mt={3} fontSize="12px">
                  On others
                </Text>
                <Text fontWeight="bold">{this.state.othersStaked} KSM</Text>
                <Text style={{ color: '#718096', fontSize: 12 }}>
                  Amount at stake for all validators combined excluding (Highest
                  staked validator)
                </Text>
              </Flex>
            </Box>
            <Stage width={width} height={height}>
              <Layer>
                <Validators
                  colorMode={this.props.colorMode}
                  allvals={this.state.validators}
                  rect_x={width / 2}
                  circ_x={width / 2 - 200 - 100}
                  circ_y={height / 2}
                  totalinfo={[]}
                  history={this.props.history}
                  validatorTableData={this.props.validatorTableData}
                />
                <Arc
                  x={width - 2}
                  y={height / 2}
                  innerRadius={height / 2 - 25}
                  outerRadius={height / 2 - 24}
                  rotation={90}
                  angle={180}
                  stroke={
                    this.props.colorMode === 'light' ? '#CBD5E0' : '#718096'
                  }
                  strokeWidth={4}
                />

                <Circle
                  x={width - 348}
                  y={height - 50}
                  radius={10}
                  fill="#319795"
                />
                <KonvaText
                  x={width - 325}
                  y={height - 56}
                  text="Nominator"
                  fill={
                    this.props.colorMode === 'light' ? '#1A202C' : '#718096'
                  }
                  fontSize={15}
                />
                <Rect
                  x={width - 360}
                  y={height - 30}
                  width={26}
                  height={15}
                  fill="#E50B7B"
                  cornerRadius={10}
                />
                <KonvaText
                  x={width - 325}
                  y={height - 30}
                  text="Validators"
                  fill={
                    this.props.colorMode === 'light' ? '#1A202C' : '#718096'
                  }
                  fontSize={15}
                />

                <Circle
                  x={width / 2 - 200 - 100}
                  y={height / 2}
                  radius={7}
                  fill="#319795"
                  onMouseOver={this.handleOnMouseOver}
                  onMouseOut={this.handleOnMouseOut}
                />

                {this.state.showValidatorAddress && (
                  <KonvaText
                    text={this.state.nominatorId}
                    x={width / 2 - 350}
                    y={height / 2 - 18}
                    fill={
                      this.props.colorMode === 'light' ? '#1A202C' : '#FFFFFF'
                    }
                  />
                )}
              </Layer>
            </Stage>
          </Grid>
          {/* <Flex justifyContent="center">
						<Box
							mt={12}
							display="flex"
							justifyContent="space-between"
							width="100%"
							maxW="960px"
							alignSelf="center"
							mb={8}
						>
							<Text>{controllername}</Text>
							<Text>{bondvalue}</Text>
						</Box>
					</Flex> */}
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

export default withRouter(NominatorApp);
