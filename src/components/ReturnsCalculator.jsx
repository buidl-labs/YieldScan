import React from "react";
import { Route } from "react-router-dom";
import {
	Box,
	Heading,
	Text,
	Flex,
	InputGroup,
	Input,
	InputRightAddon,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	Alert,
	AlertIcon,
	AlertDescription
} from "@chakra-ui/core";
import Helmet from "react-helmet";
import LogEvent from "./LogEvent";
import ExpectedReturns from "./SuggestedValidators/ExpectedReturns";
import CustomButton from "./CustomButton";
import { getRiskSliderColor, textColorLight } from "../constants";
import { getSuggestions } from "./SuggestedValidators/suggestions";

const textColor = { light: "gray.600", dark: "#FFF" };

type ReturnsCalculatorProps = {
	colorMode: "light" | "dark",
	currency: string,
	validators: Array<{}>
};

const ReturnsCalculator = (props: ReturnsCalculatorProps) => {
	const [budget, setBudget] = React.useState("");
	const [returns, setReturns] = React.useState(0.0);
	const [sliderBG, setSliderBG] = React.useState("yellow.300");
	const [isResultReady, setIsResultReady] = React.useState(false);
	const [suggestionsFound, setSuggestionsFound] = React.useState(true);

	const calculateReturns = () => {
		const { suggestedValidators, expectedReturns } = getSuggestions(
			budget,
			props.riskLevel / 100,
			props.validators
		);
		setReturns(expectedReturns);
		props.setSuggestedValidators({
			budget,
			expectedReturns,
			suggestedValidators
		});
		
		props.setValidators(suggestedValidators);
		suggestedValidators.length > 0
			? setSuggestionsFound(true)
			: setSuggestionsFound(false);
		setIsResultReady(true);
	};

	// const handleSuggestions = async () => {
	// 	calculateReturns();
	// };

	const onRiskChange = value => {
		setSliderBG(getRiskSliderColor(value / 100));
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>YieldScan - Returns Calculator</title>
				<meta name='description' content='Staking Returns Calculator' />
			</Helmet>
			<LogEvent eventType='Returns calculator view' />
			<Route exact path='/returns-calculator'>
				<Flex alignItems='center' flexWrap='wrap' justify='center'>
					<Box
						w={["100%", "80%", "80%", "90%"]}
						mx={[0, 8, 24, 0]}
						maxW='960px'
					>
						<Heading mt={16} mb={!suggestionsFound ? 4 : 12}>
							Calculate your returns on Kusama
						</Heading>
						{!suggestionsFound ? (
							<Alert status='error' mb={12}>
								<AlertIcon />
								<AlertDescription mr={2}>
									No suggestions could be found for your choices :(
								</AlertDescription>
							</Alert>
						) : (
							""
						)}
					</Box>
					<Box mr={8}>
						<Box
							color='gray.500'
							fontWeight='semibold'
							letterSpacing='wide'
							fontSize='md'
							mb={8}
						>
							<Flex flexWrap='wrap'>
								<Flex direction='column' mr={8} mb={4}>
									<Text mb={2}>I want to spend</Text>
									<Input
										placeholder='Enter your budget'
										variant='filled'
										color={textColor[props.colorMode]}
										type='number'
										min='0'
										step='0.000000000001'
										max='999999999999999'
										value={budget}
										textAlign='center'
										rounded='40px'
										onChange={e => {
											if (e.target.value) setBudget(parseFloat(e.target.value));
											else setBudget("");
										}}
									/>
								</Flex>
								<Flex direction='column'>
									<Text mb={2}>Currency</Text>
									<InputGroup>
										<InputRightAddon
											align='center'
											px={8}
											children={props.currency}
											backgroundColor='#4A5567'
											color='white'
											roundedRight='40px'
											roundedLeft='40px'
										/>
									</InputGroup>
								</Flex>
							</Flex>
						</Box>

						<Box>
							<Text
								color='gray.500'
								fontWeight='semibold'
								letterSpacing='wide'
								fontSize='md'
								mt={8}
								mb={4}
							>
								With Risk Level
							</Text>
							<Slider
								defaultValue={50}
								value={props.riskLevel}
								onChange={value => {
									props.setRiskLevel(value);
									onRiskChange(value);
								}}
							>
								<SliderTrack />
								<SliderFilledTrack bg={sliderBG} />
								<SliderThumb />
							</Slider>
							<Flex
								justifyContent='space-between'
								width='100%'
								color='gray.500'
								letterSpacing='wide'
								fontSize='sm'
								mb={8}
							>
								<Text>Low</Text>
								<Text>Medium</Text>
								<Text>High</Text>
							</Flex>
						</Box>
						<Flex flexWrap='wrap' direction='column' alignItems='flex-start'>
							<CustomButton
								disable={!budget || budget === 0}
								onClick={calculateReturns}
							>
								Calculate
							</CustomButton>
							{!budget && (
								<Text
									my={4}
									mx={1}
									fontSize='xs'
									as='i'
									color={textColorLight[props.colorMode]}
								>
									Please enter a valid budget
								</Text>
							)}
						</Flex>
					</Box>
					<Box
						m={4}
						w={[
							"100%", // base
							"100%", // 480px upwards
							"calc(50% - 2rem)", // 768px upwards
							"calc(40% - 2rem)" // 992px upwards
						]}
					>
						<ExpectedReturns
							budget={budget}
							returns={returns}
							currency={props.currency}
							button={true}
							isResultReady={isResultReady}
							suggestionsFound={suggestionsFound}
						/>
					</Box>
				</Flex>
			</Route>
		</React.Fragment>
	);
};

export default ReturnsCalculator;
