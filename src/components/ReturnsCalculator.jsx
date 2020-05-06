import React           from "react";
import { Link, Route } from "react-router-dom";
import {
	Box,
	Heading,
	Text,
	Flex,
	InputGroup,
	Input,
	InputRightAddon,
	Button,
	useColorMode,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb
}                      from "@chakra-ui/core";
import CustomButton    from "./CustomButton";
import CountUp         from "react-countup";
import Helmet          from "react-helmet";
import { useDebounce } from "use-debounce";
import LogEvent        from "./LogEvent";
import ErrorMessage    from "./ErrorMessage";
import ExpectedReturns from "./SuggestedValidators/ExpectedReturns";

const textColor = { light: "gray.600", dark: "#FFF" };

type ReturnsCalculatorProps = {
	colorMode: "light" | "dark",
	validatorData: Array<{}>,
};

const ReturnsCalculator = (props: ReturnsCalculatorProps) => {
	const { colorMode, toggleColorMode }        = useColorMode();
	const [stakeInput, setStakeInput]           = React.useState();
	const [expectedReturns, setExpectedReturns] = React.useState(0.0);
	const [suggPromptsAmount]                   = useDebounce(stakeInput / 16, 0);
	const [validatorsList, setValidatorsList]   = React.useState([]);
	const [validatorData, setValidatorData]     = React.useState([]);
	const [errorState, setErrorState]           = React.useState(false);
	const [intentionData, setIntentionData]     = React.useState([]);
	const [apiConnected, setApiConnected]       = React.useState(false);
	const [isLoaded, setIsLoaded]               = React.useState(false);
	const [riskLevel, setRiskLevel]             = React.useState(50);
	const [sliderBG, setSliderBG]               = React.useState("yellow.300");
	const ERA_PER_DAY = 4;
	// console.log('props - ', props.validatorData);

	function suggPrompts() {
		const data = validatorsList.map(validator => {
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

		//handle top 16 suggested validaors
		data.sort((a, b) => b.dailyEarningPrecise - a.dailyEarningPrecise);
		const top16data = [...data.slice(0, 16)];
		//console.log("table data of top 16 val - ", top16data);
		
		//pass props to parent App.jsx
		const propsData = {};
		if (top16data.length > 0) {
			// eslint-disable-next-line no-unused-vars
			const expectedEarning = top16data.reduce((a, b) => ({
				dailyEarningPrecise: a.dailyEarningPrecise + b.dailyEarningPrecise
			}));
			//console.log("expected earning of top 16 val - ", expectedEarning);
			propsData.expectedReturns = expectedEarning.dailyEarningPrecise;
			setExpectedReturns(expectedEarning.dailyEarningPrecise);
		}
		propsData.validatorsList = top16data;
		propsData.budget = stakeInput;
		props.onEvent(propsData);
		
		if (apiConnected) setIsLoaded(true);
	}

	React.useEffect(() => {
		setValidatorsList(props.validatorData);
	}, [props]);

	if (errorState) {
		return <ErrorMessage />;
	}

	function calculate() {
		suggPrompts();
	}

	const onRiskChange = value => {
		console.log(value);
		if (value <= 30) {
			setSliderBG("green.300");
		} else if (value > 70) {
			setSliderBG("red.400");
		} else {
			setSliderBG("yellow.300");
		}
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>YieldScan - Returns Calculator</title>
				<meta name='description' content='Validator key stats' />
			</Helmet>
			<LogEvent eventType='Returns calculator view' />
			<Route exact path='/returns-calculator'>
				<Heading mt={16} mb={12} 
					ml={"calc(15% - 2rem)" // 992px upwards
					}>
					Calculate your returns
				</Heading>
				<Flex alignItems='center' flexWrap='wrap' justify="center">
					<Box minWidth='288px' mr={8}>
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
										value={stakeInput}
										textAlign='center'
										rounded='40px'
										minWidth='299px'
										onChange={e => {
											setStakeInput(parseFloat(e.target.value));
										}}
									/>
								</Flex>
								<Flex direction='column'>
									<Text mb={2}>Currency</Text>
									<InputGroup>
										<InputRightAddon
											align='center'
											px={8}
											children='KSM'
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
								value={riskLevel}
								onChange={value => {
									setRiskLevel(value);
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
						<CustomButton
							onClick={calculate}
						>
							Calculate
						</CustomButton>
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
							returns={expectedReturns}
							currency={'KSM'}
							button={true}
						/>
					</Box>
				</Flex>
			</Route>
		</React.Fragment>
	);
}

export default ReturnsCalculator;
