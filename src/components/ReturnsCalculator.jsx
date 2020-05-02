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
	useDisclosure,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb
} from '@chakra-ui/core'
import socketIOClient from "socket.io-client";
import FAQs from './FAQs'
import HowToStake from './guides/HowToStake'
import LogEvent from './LogEvent'
import Helmet from 'react-helmet'
import { useDebounce } from 'use-debounce'
import ErrorMessage from "./ErrorMessage";

export default function ReturnsCalculator(props) {
	const { colorMode, toggleColorMode }        = useColorMode();
	const [stakeInput, setStakeInput]           = React.useState();
	const [expectedReturns, setExpectedReturns] = React.useState(0.00);
	const [suggPromptsAmount]                   = useDebounce(stakeInput/16, 0);
	const [suggPromptsData, setSuggPromptsData] = React.useState([]);
	const [validatorData, setValidatorData]     = React.useState([]);
	const [errorState, setErrorState]           = React.useState(false);
	const [intentionData, setIntentionData]     = React.useState([]);
	const [apiConnected, setApiConnected]       = React.useState(false);
	const [isLoaded, setIsLoaded]               = React.useState(false);
	const ERA_PER_DAY = 4;
	//console.log('props - ', props.validatorData);

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
		setSuggPromptsData(props.validatorData);
	}, [props]);

	if (errorState) {
		return <ErrorMessage />;
	}

	function calculate() {
		suggPrompts();
	}
	return (
		<React.Fragment>
			<Helmet>
				<title>Yield Scan - Reutrn Calculator</title>
				<meta name="description" content="Validator key stats" />
			</Helmet>
			<LogEvent eventType="Returns calculator  view" />
			<Route exact path="/returns-calculator">
					<Heading mt="10%" mb="4%">
						Calculate your returns
					</Heading>
					<SimpleGrid columns={2} spacing="10%">
						<Box>
							<Box>
								<Box
									color="gray.500"
									fontWeight="semibold"
									letterSpacing="wide"
									fontSize="lg"
									mb="4%"
								>
									<Flex>
										<Flex size="90%">
											<Text>
												I want to spent
											</Text>
										</Flex>
										<Flex>
											<Text>
												Currency
											</Text>
										</Flex>
									</Flex>
								</Box>
							</Box>
							<InputGroup>
								<Input
									placeholder='Enter your Budget'
									variant='filled'
									type='number'
									min='0'
									step='0.000000000001'
									max='999999999999999'
									value={stakeInput}
									textAlign='center'
									rounded='40px'
									mr='4%'
									onChange={e => {
									setStakeInput(parseFloat(e.target.value));
									}}
								/>
								<InputRightAddon
									align="center"
									width="20%"
									children="KSM"
									backgroundColor="#4A5567"
									color="white"
									roundedRight="40px"
									roundedLeft="40px"
								/>
							</InputGroup>
							<Box
								color="gray.500"
								fontWeight="semibold"
								letterSpacing="wide"
								fontSize="lg"
								mt="8%"
								mb="4%"
							>
								With Risk Level
							</Box>
							<Slider defaultValue={50}>
								<SliderTrack />
								<SliderFilledTrack />
								<SliderThumb />
							</Slider>
							<Box
								color="gray.500"
								letterSpacing="wide"
								fontSize="sm"
								mb="4%"
							>
								<Flex>
									<Flex size="46%">
										<Text>Low</Text>
									</Flex>
									<Flex size="55%">
										<Text>Medium</Text>
									</Flex>
									<Flex>
										<Text>High</Text>
									</Flex>
								</Flex>
							</Box>
							<Button
								marginTop="10%"
								fontSize="lg"
								background="#19CC95"
								color="white"	
								rounded="40px"
								onClick={calculate}
							>
								Calculate
							</Button>
						</Box>
						<Box
							padding="8%"
							borderWidth="1px"
							rounded="4mm"
							overflow="hidden"
							background="#19CC95"
							color="white"
						>
							<Text fontSize="180%" fontWeight="600" lineHeight="36px" mt="2%">
								Expected Results
							</Text>
							<Text fontSize="130%" lineHeight="25px" mt="6%">
								Expected Returns
							</Text>
							<Text fontSize="190%" fontWeight="600" lineHeight="36px" mt="2%">
								{ Number((expectedReturns).toFixed(5)) + ' KSM' }
							</Text>
							<Button
								marginTop="6%"
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

