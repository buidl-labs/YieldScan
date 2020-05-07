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
import {
	getRiskSliderColor,
} from "./../constants";

const textColor = { light: "gray.600", dark: "#FFF" };

type ReturnsCalculatorProps = {
	colorMode: "light" | "dark",
	currency: string,
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
					: `${dailyEarning.toPrecision(10)} ${props.currency}`,
				dailyEarningPrecise: isNaN(dailyEarning) ? 0 : dailyEarning
			};
		});

		//handle suggested validaors
		data.sort((num1, num2) => num2.dailyEarningPrecise - num1.dailyEarningPrecise);
		const suggestedValidators = [...data.slice(0, 16)];
		
		const validatorInfo = {};
		if (suggestedValidators.length > 0) {
			const expectedEarning = suggestedValidators.reduce((a, b) => ({
				dailyEarningPrecise: a.dailyEarningPrecise + b.dailyEarningPrecise
			}));
			validatorInfo.expectedReturns = expectedEarning.dailyEarningPrecise;
			setExpectedReturns(expectedEarning.dailyEarningPrecise);
		}
		validatorInfo.validatorsList = suggestedValidators;
		validatorInfo.budget = stakeInput;
		props.onEvent(validatorInfo);
		
		if (apiConnected) setIsLoaded(true);
	}

	React.useEffect(() => {
		setValidatorsList(props.validatorData);
	}, [props]);

	if (errorState) {
		return <ErrorMessage />;
	}

	function calculateReturns() {
		suggPrompts();
	}

	const onRiskChange = value => {
		setSliderBG(getRiskSliderColor(value/100));
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>YieldScan - Returns Calculator</title>
				<meta name='description' content='Staking Returns Calculator' />
			</Helmet>
			<LogEvent eventType='Returns calculator view' />
			<Route exact path='/returns-calculator'>
				<Heading mt={16} mb={12} 
					ml={"calc(15% - 2rem)" // 992px upwards
					}>
					Calculate your returns
				</Heading>
				<Flex alignItems='center' flexWrap='wrap' justify="center">
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
										value={stakeInput}
										textAlign='center'
										rounded='40px'
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
							onClick={calculateReturns}
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
							currency={props.currency}
							button={true}
						/>
					</Box>
				</Flex>
			</Route>
		</React.Fragment>
	);
}

export default ReturnsCalculator;
