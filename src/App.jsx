import React from "react";
import {
	HashRouter as Router,
	Route,
	Redirect
} from "react-router-dom";
import {
	Flex,
	useColorMode,
	Box,
	Text,
	Spinner,
	Link,
	CircularProgress,
	useDisclosure
} from "@chakra-ui/core";
import { Helmet } from "react-helmet";
import { useDebounce } from "use-debounce";
import amplitude from "amplitude-js";
import { AmplitudeProvider } from "@amplitude/react-amplitude";
import socketIOClient from "socket.io-client";
import AlertDialogContainer from "./components/LoginFlow/AlertDialogContainer";
import HelpCenter from "./components/HelpCenter.jsx";
import ReturnsCalculator from "./components/ReturnsCalculator.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import ValidatorApp from "./components/validator_components/ValidatorApp.jsx";
import NominatorApp from "./components/nominator_components/NominatorApp.jsx";
import ErrorMessage from "./components/ErrorMessage";
import NavBar from "./components/NavBar.jsx";
import SuggestedValidators from "./components/SuggestedValidators/SuggestedValidators";
import WalletConnect from "./components/WalletConnect/WalletConnect";
import ConfirmationPage from "./components/ConfirmationPage/ConfirmationPage";
import EditValidators from "./components/EditValidators/EditValidators";
import ProtectedRoute from "./components/ProtectedRoute";
import NetworkDetails from "./components/NetworkDetails/NetworkDetails";
import { currency } from "./constants";

const AMPLITUDE_KEY = "1f1699160a46dec6cc7514c14cb5c968";

function App() {
	// eslint-disable-next-line no-unused-vars
	const { colorMode } = useColorMode();
	const [electedInfo, setElectedInfo] = React.useState({});
	const [validatorData, setValidatorData] = React.useState([]);
	const [errorState, setErrorState] = React.useState(false);
	const [validatorTableData, setValidatorTableData] = React.useState([]);
	const [intentionData, setIntentionData] = React.useState([]);
	const [validatorsAndIntentions, setValidatorsAndIntentions] = React.useState(
		[]
	);
	const [, setMaxDailyEarning] = React.useState(0);
	const [stakeInput] = React.useState(1000.0);
	const [stakeAmount] = useDebounce(stakeInput, 500.0);
	const [apiConnected, setApiConnected] = React.useState(false);
	const [isLoaded, setIsLoaded] = React.useState(false);
	const [validators, setValidators] = React.useState([
		{ name: "None", stashId: "", amount: 0, risk: 0.0 }
	]);
	const [suggValidatorsData, setSuggValidatorsData] = React.useState({
		budget: "0",
		expectedReturns: "0"
	});
	const [users, setUsers] = React.useState();
	const [selectedValidators, setSelectedValidators] = React.useState(false);

	const {
		isOpen: isExtensionDialogOpen,
		onOpen: onExtensionDialogOpen,
		onClose: onExtensionDialogClose
	} = useDisclosure();
	const {
		isOpen: isCreateAccountDialogOpen,
		onOpen: onCreateAccountDialogOpen,
		onClose: onCreateAccountDialogClose
	} = useDisclosure();

	const ERA_PER_DAY = 4;
	const calcReward = React.useCallback(() => {
		const data = validatorData.map(validator => {
			const {
				stashId,
				stashIdTruncated,
				name,
				commission,
				totalStake,
				parsedStakeInfo,
				poolReward,
				noOfNominators
			} = validator;
			const userStakeFraction = stakeAmount / (stakeAmount + totalStake);
			const dailyEarning = userStakeFraction * poolReward * ERA_PER_DAY;
			return {
				noOfNominators,
				stashId,
				stashIdTruncated,
				name,
				totalStake,
				parsedStakeInfo,
				commission: `${parseFloat(commission)}%`,
				dailyEarning: isNaN(dailyEarning)
					? "Not enough data"
					: `${dailyEarning.toPrecision(10)} KSM`,
				dailyEarningPrecise: isNaN(dailyEarning) ? 0 : dailyEarning
			};
		});
		const earnings = data.map(validator => validator.dailyEarningPrecise);
		setMaxDailyEarning(Math.max(...earnings));
		setValidatorTableData(data);
		if (apiConnected) setIsLoaded(true);
	}, [stakeAmount, validatorData, apiConnected]);

	React.useEffect(() => {
		if (apiConnected) {
			calcReward();
		}
	}, [calcReward, apiConnected]);

	React.useEffect(() => {
		const validatorsInfo =
			suggValidatorsData &&
			suggValidatorsData.validatorsList &&
			suggValidatorsData.validatorsList.reduce((acc, cur) => {
				// TODO: Replace placeholder risk score with actual risk score
				acc.push({
					name: cur.name,
					stashId: cur.stashId,
					amount: parseFloat(suggValidatorsData.budget) / 16,
					risk: "0.22",
					commission: cur.commission,
					dailyEarningPrecise: cur.dailyEarningPrecise
				});
				return acc;
			}, []);
		setValidators(validatorsInfo);
	}, [suggValidatorsData]);

	React.useEffect(() => {
		const socket = socketIOClient(
			"https://polka-analytics-api-testing-sfgk.onrender.com/",
			{ transport: ["websocket"] }
		);
		socket.on(
			"initial",
			// eslint-disable-next-line no-shadow
			({ filteredValidatorsList, electedInfo, intentionsData }) => {
				if (intentionsData[0]) {
					setApiConnected(true);
					setValidatorData(filteredValidatorsList);
					setElectedInfo(electedInfo[0]);
					setIntentionData(intentionsData[0].intentions);
					setValidatorsAndIntentions(intentionsData[0].validatorsAndIntentions);
					setValidatorsAndIntentions(intentionsData[0].validatorsAndIntentions);
					setValidatorsAndIntentions(intentionsData[0].validatorsAndIntentions);
				} else {
					setErrorState(true);
				}
			}
		);

		socket.on(
			"onDataChange",
			// eslint-disable-next-line no-shadow
			({ filteredValidatorsList, electedInfo, intentionsData }) => {
				if (intentionsData[0]) {
					setApiConnected(true);
					setValidatorData(filteredValidatorsList);
					setElectedInfo(electedInfo[0]);
					setIntentionData(intentionsData[0].intentions);
					setValidatorsAndIntentions(intentionsData[0].validatorsAndIntentions);
					setValidatorsAndIntentions(intentionsData[0].validatorsAndIntentions);
					setValidatorsAndIntentions(intentionsData[0].validatorsAndIntentions);
				} else {
					setErrorState(true);
				}
			}
		);
	}, []);
	if (errorState) {
		return <ErrorMessage />;
	}

	function handleChildTabEvent(data) {
		setSuggValidatorsData({ ...data });
	}

	function handleUsers(data) {
		setUsers ({...data});
	}

	return (
		<AmplitudeProvider
			amplitudeInstance={amplitude.getInstance()}
			apiKey={AMPLITUDE_KEY}
		>
			<Helmet>
				<title>
					YieldScan - Scanning yield on nominated proof-of-stake networks
				</title>
				<meta
					name='description'
					content='A portfolio management platform for Proof of Stake Network'
				/>
			</Helmet>
			<Router>
				<ScrollToTop />
				<Route exact path='/'>
					<Redirect to='/network-details' />
				</Route>
				<NavBar
					onExtensionDialogOpen={onExtensionDialogOpen}
					onCreateAccountDialogOpen={onCreateAccountDialogOpen}
				/>
				<Flex
					className='App'
					maxW='90%'
					justify='center'
					direction='column'
					m='auto'
					pb={8}
					px={{ base: 4, md: 0 }}
				>
					{/* Homepage - Dashboard */}
					<Route path='/(|network-details)'>
						{isLoaded && apiConnected ? (
							<NetworkDetails colorMode={colorMode} currency={currency} />
						) : (
							<Box
								display='flex'
								flexDirection='column'
								position='absolute'
								top='50%'
								transform='translateY(-50%)'
								alignSelf='center'
								justifyContent='center'
								textAlign='center'
								mt={-16}
							>
								<CircularProgress
									isIndeterminate
									as='span'
									color='brand'
									size='36px'
									alignSelf='center'
								/>
								<Text mt={4} fontSize='xl' color='gray.500' maxW={300}>
									Rome wasn't built in a day...
									<br />
									But this calculation will be done in a few minutes :)
								</Text>
							</Box>
						)}
					</Route>

					<Route path='/returns-calculator'>
						<ReturnsCalculator
							colorMode={colorMode}
							currency={currency}
							validatorData={validatorData}
							onEvent={handleChildTabEvent}
						/>
					</Route>

					<Route path='/help-center'>
						<HelpCenter />
					</Route>
					{/* Suggested Validators */}
					<ProtectedRoute
						path='/suggested-validators'
						component={(props)=>
						<SuggestedValidators
							colorMode={colorMode}
							returns={parseFloat(suggValidatorsData.expectedReturns)}
							budget={parseFloat(suggValidatorsData.budget)}
							currency={currency}
							validatorsList={validators}
							selectedValidators={selectedValidators}
						/>
						}
					/>
					{/* PolkaWallet Connect */}
					<Route path='/wallet-connect'>
						<WalletConnect 
							colorMode={colorMode} 
							users={handleUsers}
						/>
					</Route>
					{/* Edit Validators */}
					<ProtectedRoute
						path='/edit-validators'
						component={(props)=>
						<EditValidators
							colorMode={colorMode}
							currency={currency}
							amount={parseFloat(suggValidatorsData.budget)}
							validatorsList={validators}
							validatorTableData={validatorTableData}
							onEvent={(data) => {
								setValidators([...data]);
							}}
							selectedValidators={(state) => {
								setSelectedValidators(state);
							}}
						/>
						}
					/>
					{/* Confirmation */}
					<ProtectedRoute
						path='/confirmation'
						component={(props)=>
						<ConfirmationPage
							colorMode={colorMode}
							stashOptions={[{ option: "Account Name", value: "AccountID" }]}
							controllerOptions={[
								{ option: "Account Name", value: "AccountID" }
							]}
							riskPreference={0.5}
							fees='10.0 milli'
							eras={4}
							amount={parseFloat(suggValidatorsData.budget)}
							currency={currency}
							validatorsList={validators}
							users={users}
						/>
						}
					/>
				</Flex>

				<Route
					path='/kusama/validator/'
					render={props => {
						if (!props.history.location.pathname.split("/")[3]) {
							return (
								<div
									style={{
										display: "grid",
										justifyContent: "center",
										alignItems: "center",
										height: "calc(100vh - 40px)"
									}}
								>
									<p
										style={{
											fontSize: "30px",
											fontWeight: "bold"
										}}
									>
										Oops! URL must include a validator's address
									</p>
								</div>
							);
						}
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
								isKusama
							/>
						) : (
							<Box
								display='flex'
								flexDirection='column'
								position='absolute'
								top='50%'
								left='50%'
								transform='translate(-50%, -50%)'
								alignSelf='center'
								justifyContent='center'
								textAlign='center'
								mt={-16}
								zIndex={-1}
							>
								<Spinner as='span' size='lg' alignSelf='center' />
								<Text
									mt={4}
									fontSize='xl'
									color='gray.500'
									textAlign='center'
									alignSelf='center'
								>
									Unboxing pure awesomeness...
								</Text>
							</Box>
						);
					}}
				/>
				{/* Nominator specific view */}
				<Route path='/kusama/nominator/'>
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
							display='flex'
							flexDirection='column'
							position='absolute'
							top='50%'
							left='50%'
							transform='translate(-50%, -50%)'
							alignSelf='center'
							justifyContent='center'
							textAlign='center'
							mt={-16}
							zIndex={-1}
						>
							<Spinner as='span' size='lg' alignSelf='center' />
							<Text
								mt={4}
								fontSize='xl'
								color='gray.500'
								textAlign='center'
								alignSelf='center'
							>
								Stabilizing the isotopes...
							</Text>
						</Box>
					)}
				</Route>
			</Router>
			<AlertDialogContainer
				isOpen={isExtensionDialogOpen}
				onClose={onExtensionDialogClose}
				title='Polkadot JS Extension Required!'
				body={
					<>
						PolkadotJs extension allows you to manage your polkadot accounts
						outside of dapps. Injects the accounts and allows signs transactions
						for a specific account.
						<div>
							<Link
								href='https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd?hl=en'
								isExternal
								color='teal.500'
							>
								Add PolkadotJs Extension
							</Link>
						</div>
					</>
				}
			/>
			<AlertDialogContainer
				isOpen={isCreateAccountDialogOpen}
				onClose={onCreateAccountDialogClose}
				title='Create atleast one account from polkadot extension!'
				body={
					<React.Fragment>
						Create atleast one account from PolkadotJs extension for making
						transactions for a specific account.
					</React.Fragment>
				}
			/>
		</AmplitudeProvider>
	);
}

export default App;
