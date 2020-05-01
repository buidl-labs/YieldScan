import React from 'react'
import { Route, Link } from 'react-router-dom'
import {
	Box,
	Heading,
	Text,
	Flex,
	InputGroup,
	Input,
	InputRightAddon,
	Icon,
	Button,
	Link as ChakraLink,
	SimpleGrid,
	useColorMode,
	useDisclosure
} from '@chakra-ui/core'
import socketIOClient from "socket.io-client";
import FAQs from './FAQs'
import HowToStake from './guides/HowToStake'
import LogEvent from './LogEvent'
import Helmet from 'react-helmet'
import { useDebounce } from 'use-debounce'
import ErrorMessage from "./ErrorMessage";

export default function ReturnsCalculator() {
	const [stakeInput, setStakeInput]           = React.useState();
	const [expectedReturns, setExpectedReturns] = React.useState(0.00);
	const [suggPromptsAmount]                   = useDebounce(stakeInput / 16, 500.0);
	const [suggPromptsData, setSuggPromptsData] = React.useState([]);
	const [validatorData, setValidatorData]     = React.useState([]);
	const [errorState, setErrorState]           = React.useState(false);
	const [intentionData, setIntentionData]     = React.useState([]);
	const [apiConnected, setApiConnected]       = React.useState(false);
	const [isLoaded, setIsLoaded]               = React.useState(false);
	const ERA_PER_DAY = 4;

	function suggPrompts() {
		const data = suggPromptsData.map(validator => {
			const {
				stashId,
				stashIdTruncated,
				name,
				commission,
				totalStake,
				poolReward,
				noOfNominators
			} = validator;
			const userStakeFraction =
				suggPromptsAmount / (suggPromptsAmount + totalStake);
			const dailyEarning = userStakeFraction * poolReward * ERA_PER_DAY;
			return {
				noOfNominators,
				stashId,
				stashIdTruncated,
				name,
				commission: `${parseFloat(commission)}%`,
				dailyEarning: isNaN(dailyEarning)
					? "Not enough data"
					: `${dailyEarning.toPrecision(10)} KSM`,
				dailyEarningPrecise: isNaN(dailyEarning) ? 0 : dailyEarning
			};
		});
		data.sort((a, b) => b.dailyEarningPrecise - a.dailyEarningPrecise);
		const top16data = [...data.slice(0, 16)];
		// console.log("table data of top 16 val - ", top16data);
		if (top16data.length > 0) {
			// eslint-disable-next-line no-unused-vars
			const expectedEarning = top16data.reduce((a, b) => ({
				dailyEarningPrecise: a.dailyEarningPrecise + b.dailyEarningPrecise
			}));
			console.log("expected earning of top 16 val - ", expectedEarning);
			setExpectedReturns (expectedEarning.dailyEarningPrecise);
		}
		if (apiConnected) setIsLoaded(true);
	}
	
	React.useEffect(() => {
		const socket = socketIOClient("https://polka-analytic-api.herokuapp.com/");
		socket.on(
			"initial",
			// eslint-disable-next-line no-shadow
			({ filteredValidatorsList, intentionsData }) => {
				if (intentionsData[0]) {
					setApiConnected(true);
					setSuggPromptsData(filteredValidatorsList);
				} else {
					setErrorState(true);
				}
			}
		);

		socket.on(
			"onDataChange",
			// eslint-disable-next-line no-shadow
			({ filteredValidatorsList, intentionsData }) => {
				if (intentionsData[0]) {
					setApiConnected(true);
					setSuggPromptsData(filteredValidatorsList);
				} else {
					setErrorState(true);
				}
			}
		);
	}, []);

	if (errorState) {
		return <ErrorMessage />;
	}

	function calculate() {
		suggPrompts();
	}
	return (
		<React.Fragment>
			<Helmet>
				<title>Polka Analytics - Reutrn Calculator</title>
				<meta name="description" content="Validator key stats" />
			</Helmet>
			<LogEvent eventType="Returns calculator  view" />
			<Route exact path="/returns-calculator">
					<Heading mt="10%" mb="4%">
						Calculate your returns
					</Heading>
					<SimpleGrid columns={2} spacing="10%">
						<Box>
							<Box
								color="gray.500"
								fontWeight="semibold"
								letterSpacing="wide"
								fontSize="md"
								mb="8px"
							>
								I want to spent:
							</Box>
							<InputGroup>
								<Input
									placeholder="Enter your Budget"
									variant="filled"
									type="number"
									min="0"
									step="0.000000000001"
									max="999999999999999"
									value={stakeInput}
									textAlign="center"
									rounded="40px"
									mr="8px"
									onChange={e => {
									setStakeInput(
									parseFloat(e.target.value)
									)
									}}
								/>
								<InputRightAddon
									children="KSM"
									backgroundColor="#4A5567"
									color="white"
									roundedRight="40px"
									roundedLeft="40px"
								/>
							</InputGroup>
							<Button
								marginTop="25px"
								background="#19CC95"
								color="white"	
								rounded="40px"
								onClick={calculate}
							>
								Calculate
							</Button>
						</Box>
						<Box
							padding="30px"
							borderWidth="1px"
							rounded="4mm"
							overflow="hidden"
							background="#19CC95"
							color="white"
						>
							<Text fontSize="30px" fontWeight="600" lineHeight="36px" mt="2%">
								Expected Results
							</Text>
							<Text fontSize="21px" lineHeight="25px" mt="6%">
								Expected Returns
							</Text>
							<Text fontSize="30px" fontWeight="600" lineHeight="36px" mt="2%">
								{ expectedReturns + ' KSM' }
							</Text>
							<Button
								marginTop="25px"
								background="white"
								color="#19CC95"	
								rounded="40px"
							>
								Start Investing
							</Button>
						</Box>
					</SimpleGrid>
			</Route>
		</React.Fragment>
		)
}

