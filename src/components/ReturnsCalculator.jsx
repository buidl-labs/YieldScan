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
	const { colorMode, toggleColorMode } = useColorMode();
	const [validatorData, setValidatorData] = React.useState([]);
	const [errorState, setErrorState] = React.useState(false);
	const [intentionData, setIntentionData] = React.useState([]);
	const [apiConnected, setApiConnected] = React.useState(false);
	const [isLoaded, setIsLoaded] = React.useState(false);
	const ERA_PER_DAY = 4;

	const [suggPromptsAmount] = useDebounce(stakeInput / 16, 500.0);
	const [suggPromptsData, setSuggPromptsData] = React.useState([]);
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
				<Box
					borderWidth="0px"
					rounded="1g"
					overflow="hidden"
					margin="5%"
				>
				<Heading mt="8%">
					Calculate your returns
				</Heading>
					<SimpleGrid columns={2}>
						<Box p="6">
							<Box d="flex" alignItems="baseline">
								<Box
									color="gray.500"
									fontWeight="semibold"
									letterSpacing="wide"
									fontSize="md"
									ml="2"
									margin="1%"
									textAlign="left"
								>
									I want to spent:
								</Box>
							</Box>
							<InputGroup>
								<Input
									placeholder="Enter your Budget"
									variant="filled"
									type="number"
									marginBottom="15px"
									min="0"
									step="0.000000000001"
									max="999999999999999"
									value={stakeInput}
									textAlign="center"
									roundedLeft="2rem"
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
									roundedRight="2rem"
								/>
							</InputGroup>
							<Button
								background="#19CC95"
								color="white"	
								rounded="2rem"
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
							<Heading as="h2">
								Expected Results
							</Heading>
							<Text fontSize="6x1" mt="2%">
								Expected Returns
							</Text>
							<Heading as="h2">
								{ expectedReturns + ' KSM' }
							</Heading>
						</Box>
					</SimpleGrid>
				</Box>
			</Route>
		</React.Fragment>
		)
}

