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
	CircularProgress,
	Link as ChakraLink
} from "@chakra-ui/core";
import {Helmet} from "react-helmet";
import { useDebounce } from "use-debounce";
import ValidatorTable from "./components/ValidatorTable";
import HelpCenter from "./components/HelpCenter";
import amplitude from "amplitude-js";
import { AmplitudeProvider } from "@amplitude/react-amplitude";
import ScrollToTop from "./ScrollToTop";
import ValidatorApp from "./components/validator_components/ValidatorApp";
import NominatorApp from "./components/nominator_components/NominatorApp";
import socketIOClient from "socket.io-client";
import LogEvent from './components/LogEvent';

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
		if (apiConnected) calcReward();
	}, [calcReward, apiConnected]);

	React.useEffect(() => {
		const socket = socketIOClient("https://evening-sea-52088.herokuapp.com/")
		socket.on("initial", ({filteredValidatorsList, electedInfo, intentionsData}) => {
			setApiConnected(true);
			setValidatorData(filteredValidatorsList);
			setElectedInfo(electedInfo[0]);
			setIntentionData(intentionsData[0].intentions);
			setValidatorsAndIntentions(intentionsData[0].validatorsAndIntentions)
		});

		socket.on("onDataChange", ({filteredValidatorsList, electedInfo, intentionsData}) => {
			setValidatorData(filteredValidatorsList);
			setElectedInfo(electedInfo[0]);
			setIntentionData(intentionsData[0].intentions);
			setValidatorsAndIntentions(intentionsData[0].validatorsAndIntentions)
		});
	}, [])


	return (
		<AmplitudeProvider
			amplitudeInstance={amplitude.getInstance()}
			apiKey={AMPLITUDE_KEY}
		>
			<Helmet>
				<title>Analytics platform for the Polkadot Network - Polka Analytics</title>
				<meta name="description" content="An analytics platform for the Polkadot Network" />
			</Helmet>
			<LogEvent eventType="Home dashboard view" />
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
				<Route path="/kusama/validator/" render={(props) => {
					if(!props.history.location.pathname.split("/")[3]){
						return <div style={{
								display: 'grid',
								justifyContent: 'center',
								alignItems: 'center',
								height: 'calc(100vh - 40px)',
							}}><p style={{
								fontSize: '30px',
								fontWeight: 'bold'}}>
								Oops! URL must include a validator's address
								</p>
							</div>
					}else{
						if(validatorData.some(validator => validator.stashId === props.history.location.pathname.split("/")[3].toString())){
							return isLoaded && apiConnected ? (
								<ValidatorApp
									colorMode={colorMode}
									electedInfo={electedInfo}
									valtotalinfo={validatorData.map(data => data.stashId)}
									validatorData={validatorData}
									validatorTableData={validatorTableData}
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
							)
						}else{
							return <div style={{
								display: 'grid',
								justifyContent: 'center',
								alignItems: 'center',
								height: 'calc(100vh - 40px)',
								textAlign: "center"
							}}><p style={{
								fontSize: '30px',
								fontWeight: 'bold',
								margin: '0 50px'}}>
								Oops! validator's address doesn't exist, or it might not be activated yet.
								<p style={{
									fontSize: '20px',
									fontWeight: 'normal',
									margin: '0 50px',
									textAlign: "center"
								}}>If you think this is a mistake on our end, 
								then please bear with us and report it here {' '}
								<ChakraLink
									href="mailto:bhaskar@thevantageproject.com"
									color="teal.500"
								>
									bhaskar@thevantageproject.com
								</ChakraLink>
								, we will
								reach out to you as soon as possible</p>
								</p>
							</div>
						}
					}
				}}>
					
				</Route>
				{/* Nominator specific view */}
				<Route path="/kusama/nominator/">
					{isLoaded && apiConnected ? (
						<NominatorApp
							colorMode={colorMode}
							electedInfo={electedInfo}
							validatorTableData={validatorTableData}
							valtotalinfo={validatorData.map(data => data.stashId)}
							intentions={intentionData}
							validatorData={validatorData}
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
