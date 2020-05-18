import React from "react";
import { HashRouter as Router, Route, Redirect } from "react-router-dom";
import { Flex, useColorMode } from "@chakra-ui/core";
import { Helmet } from "react-helmet";
import amplitude from "amplitude-js";
import { AmplitudeProvider } from "@amplitude/react-amplitude";
import ReturnsCalculator from "./components/ReturnsCalculator.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import ErrorMessage from "./components/ErrorMessage";
import NavBar from "./components/NavBar.jsx";
import SuggestedValidators from "./components/SuggestedValidators/SuggestedValidators";
import WalletConnect from "./components/WalletConnect/WalletConnect";
import ConfirmationPage from "./components/ConfirmationPage/ConfirmationPage";
import EditValidators from "./components/EditValidators/EditValidators";
import ProtectedRoute from "./components/ProtectedRoute";
import NetworkDetails from "./components/NetworkDetails/NetworkDetails";
import { currency } from "./constants";
import Loader from "./Loader";
import getValidatorInfo from "./getValidatorInfo";

const AMPLITUDE_KEY = "1f1699160a46dec6cc7514c14cb5c968";

function App() {
	const { colorMode } = useColorMode();
	const [errorState] = React.useState(false);
	const [riskLevel, setRiskLevel] = React.useState(50);
	const [validatorTableData, setValidatorTableData] = React.useState([]);
	const [isLoaded, setIsLoaded] = React.useState(false);
	const [validators, setValidators] = React.useState([
		{ name: "None", stashId: "", amount: 0, risk: 0.0 }
	]);
	const [suggestedValidatorsData, setSuggestedValidatorsData] = React.useState({
		budget: "0",
		expectedReturns: "0",
		suggestedValidators: []
	});
	const [users, setUsers] = React.useState();
	const [selectedValidators, setSelectedValidators] = React.useState(false);

	const handleSuggestedValidators = val => {
		setSuggestedValidatorsData(val);
	};

	React.useEffect(() => {
		setValidators(suggestedValidatorsData.suggestedValidators);
	}, [suggestedValidatorsData.suggestedValidators]);

	const handleUsers = data => {
		setUsers({ ...data });
	};

	React.useEffect(() => {
		const getInfo = async () => {
			const validatorInfo = await getValidatorInfo();
			if (validatorInfo.length > 0) {
				setValidatorTableData(await validatorInfo);
				setIsLoaded(true);
			}
		};
		getInfo();
	}, []);

	if (errorState) {
		return <ErrorMessage />;
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
				<NavBar />
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
						{isLoaded ? (
							<NetworkDetails
								colorMode={colorMode}
								currency={currency}
								validators={validatorTableData}
							/>
						) : (
							<Loader />
						)}
					</Route>

					<Route path='/returns-calculator'>
						{isLoaded ? (
							<ReturnsCalculator
								colorMode={colorMode}
								currency={currency}
								validators={validatorTableData}
								setSuggestedValidators={handleSuggestedValidators}
								riskLevel={riskLevel}
								setRiskLevel={setRiskLevel}
							/>
						) : (
							<Loader />
						)}
					</Route>

					{/* <Route path='/help-center'>
						<HelpCenter />
					</Route> */}

					<ProtectedRoute
						path='/suggested-validators'
						component={() => (
							<SuggestedValidators
								colorMode={colorMode}
								returns={parseFloat(suggestedValidatorsData.expectedReturns)}
								budget={parseFloat(suggestedValidatorsData.budget)}
								currency={currency}
								validatorsList={validators}
								selectedValidators={selectedValidators}
							/>
						)}
					/>
					{/* PolkaWallet Connect */}
					<Route path='/wallet-connect'>
						<WalletConnect colorMode={colorMode} users={handleUsers} />
					</Route>
					{/* Edit Validators */}
					<ProtectedRoute
						path='/edit-validators'
						component={() => (
							<EditValidators
								colorMode={colorMode}
								currency={currency}
								amount={parseFloat(suggestedValidatorsData.budget)}
								validatorsList={suggestedValidatorsData.suggestedValidators}
								validatorTableData={validatorTableData}
								setValidators={data => {
									setValidators([...data]);
								}}
								selectedValidators={state => {
									setSelectedValidators(state);
								}}
								isSelected={selectedValidators}
							/>
						)}
					/>
					{/* Confirmation */}
					<ProtectedRoute
						path='/confirmation'
						component={() => (
							<ConfirmationPage
								colorMode={colorMode}
								stashOptions={[{ option: "Account Name", value: "AccountID" }]}
								controllerOptions={[
									{ option: "Account Name", value: "AccountID" }
								]}
								riskPreference={riskLevel / 100}
								fees='10.0 milli'
								eras={4}
								amount={parseFloat(suggestedValidatorsData.budget)}
								currency={currency}
								validatorsList={validators}
								users={users}
							/>
						)}
					/>
				</Flex>
			</Router>
		</AmplitudeProvider>
	);
}

export default App;
