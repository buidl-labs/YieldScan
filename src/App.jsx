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

import Testing from "./components/Testing";
import getNominatorInfo from "./getNominatorInfo.js";

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
	const [selected, setSelected] = React.useState(false);
	const [nominatorInfo, setNominatorInfo] = React.useState();

	const handleSuggestedValidators = val => {
		setSuggestedValidatorsData(val);
	};

	const handleUsers = data => {
		setUsers({ ...data });
	};

	const handleSelectedValidators = data => {
		console.log("handleSelectedValidators gives:")
		console.log(data)
		setValidators(data);
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

	React.useEffect(() => {
		const nominators = async () => {
			const info = await getNominatorInfo();
			setNominatorInfo(info);
		};
		nominators();
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
								nominators={nominatorInfo}
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
								setValidators={handleSelectedValidators}
							/>
						) : (
							<Loader />
						)}
					</Route>

					<ProtectedRoute
						path='/suggested-validators'
						component={() => (
							<SuggestedValidators
								colorMode={colorMode}
								returns={parseFloat(suggestedValidatorsData.expectedReturns)}
								budget={parseFloat(suggestedValidatorsData.budget)}
								currency={currency}
								validatorsList={validators}
								selectedValidators={selected}
								setValidators={handleSelectedValidators}
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
								validatorTableData={validatorTableData}
								setValidators={handleSelectedValidators}
								validators={validators}
								isSelected={selected}
								setSelected={setSelected}
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
