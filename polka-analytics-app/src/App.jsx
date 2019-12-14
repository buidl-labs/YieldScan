import React from "react";
import {
	HashRouter as Router,
	Link as RouterLink,
	NavLink,
	Route,
	Redirect
} from "react-router-dom";
import {
	Flex,
	IconButton,
	useColorMode,
	Box,
	Image,
	Heading,
	Text,
	Input,
	InputGroup,
	InputRightAddon,
	Spinner,
	Link,
	CircularProgress
} from "@chakra-ui/core";
import { useDebounce } from "use-debounce";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { hexToString } from "@polkadot/util";
import ValidatorTable from "./components/ValidatorTable";
import HelpCenter from "./components/HelpCenter";
import amplitude from "amplitude-js";
import { AmplitudeProvider, LogOnMount } from "@amplitude/react-amplitude";
import ScrollToTop from "./ScrollToTop";
import ValidatorApp from "./components/validator_components/ValidatorApp";
import NominatorApp from "./components/nominator_components/NominatorApp";

const AMPLITUDE_KEY = "1d3873d97d87e9193e7e30529d8a10ab";

function App() {
	const { colorMode, toggleColorMode } = useColorMode();
	const [electedInfo, setElectedInfo] = React.useState({});
	const [validatorData, setValidatorData] = React.useState([]);
	const [validatorTableData, setValidatorTableData] = React.useState([]);
	const [intentionData, setIntentionData] = React.useState([]);
	const [validatorsAndIntentions, setValidatorsAndIntentions] = React.useState(
		[]
	);
	const [maxDailyEarning, setMaxDailyEarning] = React.useState(0);
	const [stakeInput, setStakeInput] = React.useState(1000.0);
	const [stakeAmount] = useDebounce(stakeInput, 1000)
	const [apiConnected, setApiConnected] = React.useState(false);
	const [isLoaded, setIsLoaded] = React.useState(false);
	const ERA_PER_DAY = 4;

	const createApi = async () => {
		// console.log(`Connecting to API...`);
		const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io");
		const api = await ApiPromise.create({ provider: wsProvider });
		await api.isReady;
		// console.log(`API is ready`);
		// console.clear();
		// Fetch recent reward events from Polkascan
		const res = await fetch(
			"https://polkascan.io/kusama-cc3/api/v1/event?&filter[module_id]=staking&filter[event_id]=Reward&page[size]=10"
		);
		const json = await res.json();
		const rewardData = await json.data;

		// Retrieve currentElected validators for current block
		const currentValidators = await api.query.staking.currentElected();
		// Retrieve all validators
		const allValidators = await api.query.staking.validators();
		// Parse validators
		const parsedValidators = JSON.parse(JSON.stringify(allValidators))[0];
		// Retrieve session validators
		const sessionValidators = await api.query.session.validators();
		const intentions = await parsedValidators.filter(
			validator => !sessionValidators.includes(validator)
		);
		const validatorsAndIntentions = [...sessionValidators, ...intentions];
		// Retrieve the last known era reward
		const reward = await rewardData[0].attributes.attributes[0].value;
		// Retrieve the hashes of the end of era blocks
		const hash = await Promise.all(
			rewardData.map(data =>
				api.rpc.chain.getBlockHash(data.attributes.block_id - 1)
			)
		);
		// Retrieve the era points for all end of era blocks
		const eraPoints = await Promise.all(
			hash.map(data =>
				api.query.staking.currentEraPointsEarned.at(`${data.toString()}`)
			)
		);
		// Retrieve an array of the list of all elected validators at the end of era blocks
		const validatorList = await Promise.all(
			hash.map(data =>
				api.query.staking.currentElected.at(`${data.toString()}`)
			)
		);

		let result = {};

		await Promise.all(
			validatorList.map(async validator => {
				await Promise.all(
					validator.map(async address => {
						const commission = await api.query.staking.validators(address);
						const name = await api.query.nicks.nameOf(`${address.toString()}`);
						result[address] = {
							stashId: address.toString(),
							stashIdTruncated: `${address
								.toString()
								.slice(0, 4)}...${address.toString().slice(-6, -1)}`,
							points: [],
							poolReward: "",
							totalStake: "",
							commission: commission[0].commission.toNumber() / 10 ** 7,
							name: name.raw[0]
								? hexToString(name.raw[0].toString())
								: `Validator (...${address.toString().slice(-6, -1)})`
						};
					})
				);
			})
		);

		eraPoints.map((eraPoint, index) => {
			eraPoint.individual.map((point, validatorIndex) => {
				result[validatorList[index][validatorIndex]].points.push(
					point.toNumber() / eraPoint.total.toNumber()
				);
				return 0;
			});
			return 0;
		});

		const validatorData = await Promise.all(
			Object.keys(result).map(async (key, index) => {
				const validatorPoolReward =
					((result[key].points.reduce((acc, curr) => acc + curr, 0) /
						result[key].points.length) *
						reward) /
					10 ** 12;
				const electedInfo = await api.derive.staking.electedInfo();
				const stakeInfo = await api.derive.staking.account(key.toString());
				const totalStake =
					stakeInfo !== undefined
						? stakeInfo.stakers.total.toString() / 10 ** 12
						: undefined;
				result[key].totalStake = totalStake;
				result[key].poolReward = isNaN(validatorPoolReward)
					? "Not enough data"
					: (1 - result[key].commission / 100) * validatorPoolReward;
				setElectedInfo(electedInfo);
				return result[key];
			})
		);
		const filteredValidatorData = validatorData.filter(curr =>
			currentValidators.includes(curr.stashId)
		);
		setApiConnected(true);
		setValidatorData(filteredValidatorData);
		setIntentionData(intentions);
		setValidatorsAndIntentions(validatorsAndIntentions);
		return filteredValidatorData;
	};

	const calcReward = React.useCallback(() => {
		const data = validatorData.map(validator => {
			const {
				stashId,
				stashIdTruncated,
				name,
				commission,
				totalStake,
				poolReward
			} = validator;
			const userStakeFraction = stakeAmount / (stakeAmount + totalStake);
			const dailyEarning = userStakeFraction * poolReward * ERA_PER_DAY;
			return {
				stashId: stashId,
				stashIdTruncated: stashIdTruncated,
				name: name,
				commission: `${parseFloat(commission)}%`,
				dailyEarning: isNaN(dailyEarning)
					? "Not enough data"
					: `${dailyEarning.toPrecision(10)} KSM`,
				dailyEarningPrecise: isNaN(dailyEarning) ? 0 : dailyEarning
			};
		});
		const earnings = data.map(data => data.dailyEarningPrecise);
		setMaxDailyEarning(Math.max(...earnings));
		setValidatorTableData(data);
		if (apiConnected) setIsLoaded(true);
	}, [stakeAmount, validatorData, apiConnected]);

	React.useEffect(() => {
		createApi();
	}, []);

	React.useEffect(() => {
		if (apiConnected) calcReward();
	}, [calcReward, apiConnected]);

	return (
		<AmplitudeProvider
			amplitudeInstance={amplitude.getInstance()}
			apiKey={AMPLITUDE_KEY}
		>
			<LogOnMount eventType="Use Count" />
			<Router>
				<ScrollToTop />
				<Route exact path="/">
					<Redirect to="/dashboard" />
				</Route>
				<Flex
					className="App"
					maxW="960px"
					justify="center"
					direction="column"
					m="auto"
					pb={8}
				>
					{/* Navbar */}
					<Flex
						direction="row"
						justifyContent="space-between"
						zIndex={999}
						p={2}
					>
						{/* Polka Analytics Logo - Left hand part of navbar */}
						<Flex justify="flex-start" alignItems="center">
							<NavLink to="/">
								<Box as="span" display="inline-flex" alignItems="center">
									<Image src="/logo192.png" height="2rem" mr={4} />
									<Heading as="h3" size="lg">
										Polka Analytics
									</Heading>
								</Box>
							</NavLink>
						</Flex>
						{/* Navigation Menu & color mode toggle - Right hand part of navbar */}
						<Flex justify="flex-end">
							<Flex alignItems="center">
								<Box mr={8}>
									<Link as={NavLink} className="nav-link" to="/dashboard">
										Dashboard
									</Link>
								</Box>
								<Box mr={8}>
									<Link as={NavLink} className="nav-link" to="/help-center">
										Help Center
									</Link>
								</Box>
							</Flex>
							<IconButton
								aria-label={
									colorMode === "light"
										? "Switch to dark mode"
										: "Switch to light mode"
								}
								icon={colorMode === "light" ? "moon" : "sun"}
								size="lg"
								onClick={toggleColorMode}
								backgroundColor={colorMode === "light" ? "#fff" : "gray.800"}
							/>
						</Flex>
					</Flex>
					{/* Homepage - Dashboard */}
					<Route exact path="/(|dashboard)">
						{isLoaded && apiConnected ? (
							<React.Fragment>
								<Heading as="h2" size="xl" textAlign="center" mt={16}>
									Put your KSM tokens to work
								</Heading>
								<Text fontSize="2xl" textAlign="center" mb={4}>
									You could be earning{" "}
									<Box as="span" color="brand.900">
										{maxDailyEarning}
									</Box>{" "}
									KSM daily
								</Text>
								{/* Stake Amount Input */}
								<Flex
									flexDirection="column"
									alignItems="center"
									position="sticky"
									top="0"
									zIndex="999"
									backgroundImage={
										colorMode === "light"
											? "linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 1), rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))"
											: "linear-gradient(rgba(26, 32, 44, 1), rgba(26, 32, 44, 1), rgba(26, 32, 44, 1), rgba(26, 32, 44, 0))"
									}
									pt={8}
									pb={12}
								>
									<Text mb={2} fontSize="md" color="gray.500">
										Stake amount (change input to see potential earnings)
									</Text>
									<InputGroup>
										<Input
											placeholder="Stake Amount"
											variant="filled"
											value={stakeInput}
											textAlign="center"
											roundedLeft="2rem"
											onChange={e => {
												setStakeInput(
													isNaN(parseFloat(e.target.value))
														? 0
														: parseFloat(e.target.value)
												);
											}}
										/>
										<InputRightAddon
											children="KSM"
											backgroundColor="teal.500"
											roundedRight="2rem"
										/>
									</InputGroup>
								</Flex>
								<Box as="span" color="teal.500" textAlign="center">
									<Link as={RouterLink} to="/help-center/guides/how-to-stake">
										How to stake?
									</Link>
								</Box>
								{/* Validator Table */}
								<Text textAlign="center" mt={16} mb={8}>
									Looking for a list of active validators to stake on? Look no
									further!
								</Text>
								<ValidatorTable
									colorMode={colorMode}
									dataSource={
										validatorTableData !== undefined ? validatorTableData : []
									}
								/>
							</React.Fragment>
						) : (
							<Box
								display="flex"
								flexDirection="column"
								position="absolute"
								top="50%"
								transform="translateY(-50%)"
								alignSelf="center"
								justifyContent="center"
								textAlign="center"
								mt={-16}
							>
								<CircularProgress
									isIndeterminate
									as="span"
									color="brand"
									size="36px"
									alignSelf="center"
								/>
								<Text mt={4} fontSize="xl" color="gray.500" maxW={300}>
									Rome wasn't built in a day...
									<br />
									But this calculation will be done in a few minutes :)
								</Text>
							</Box>
						)}
					</Route>

					{/* Help Center */}
					<Route path="/help-center">
						<HelpCenter />
					</Route>
				</Flex>
				{/* Validator specific view */}
				<Route path="/kusama/validator/">
					{isLoaded && apiConnected ? (
						<ValidatorApp
							colorMode={colorMode}
							electedInfo={electedInfo}
							valtotalinfo={validatorData.map(data => data.stashId)}
							intentions={intentionData}
							validatorsandintentions={validatorsAndIntentions}
							validatorandintentionloading={!isLoaded}
							isKusama={true}
						/>
					) : (
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
								Unboxing pure awesomeness...
							</Text>
						</Box>
					)}
				</Route>
				{/* Nominator specific view */}
				<Route path="/kusama/nominator/">
					{isLoaded && apiConnected ? (
						<NominatorApp
							colorMode={colorMode}
							electedInfo={electedInfo}
							valtotalinfo={validatorData.map(data => data.stashId)}
							intentions={intentionData}
							validatorsandintentions={validatorsAndIntentions}
							validatorandintentionloading={!isLoaded}
						/>
					) : (
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
					)}
				</Route>
			</Router>
		</AmplitudeProvider>
	);
}

export default App;
