import React from "react";
import { useHistory, Route, Link } from "react-router-dom";
import {
	Box,
	Heading,
	Flex,
	Text,
	ButtonGroup,
	Icon
} from "@chakra-ui/core";
import Helmet from "react-helmet";
import Footer from "../Footer.jsx";
import ValidatorTile from "./ValidatorTile";
import ExpectedReturns from "./ExpectedReturns";
import CustomButton from "../CustomButton";
import Auth from "../Auth";

type SuggestedValidatorsProps = {
	colorMode: "light" | "dark",
	validatorsList: Array<{
		name: string,
		stashId: string,
		amount: float,
		risk: float,
		dailyEarningPrecise: float
	}>,
	returns: float,
	budget: float,
	currency: string,
	selectedValidators: boolean
};

const SuggestedValidators = (props: SuggestedValidatorsProps) => {
	const history = useHistory();
	const [returns, setReturns] = React.useState(0);	
	React.useEffect(()=>{
		const result = props.validatorsList && props.validatorsList.reduce(function(total, cur) {
			return total + cur.dailyEarningPrecise;
		}, 0);
		setReturns(result);
	}, [props, returns]);

	return (
		<React.Fragment>
			<Helmet>
				<title>Yield Scan &middot; Suggested Validators</title>
			</Helmet>
			<Route exact path='/suggested-validators'>
				<Box m={4} mt={10}>
					{!props.selectedValidators ?
					<Link
						onClick={() => {
						Auth.logout(() => {
						history.push('/returns-calculator');
						})
						}}
					>
						<Icon name='arrow-back' mr={1} /> 
						Returns Calculator
					</Link>
					:
					<Link
						onClick={() => {
						history.push('/edit-validators');
						}}
					>
						<Icon name='arrow-back' mr={1} /> 
						Edit Validators
					</Link>
					}
				</Box>
				<Flex py={0} wrap='wrap-reverse'>
					<Box
						p={[1, 1, 2, 4]}
						m={[1, 1, 2, 4]}
						w={[
							"100%", // base
							"100%", // 480px upwards
							"calc(50% - 2rem)", // 768px upwards
							"calc(60% - 2rem)" // 992px upwards
						]}
					>
						{!props.selectedValidators ?
						<Heading>Suggested Validators</Heading>
						:
						<Heading>Selected Validators</Heading>
						}
						{
							<Text>
								Staking a budget of {props.budget} {props.currency} to 16
								recommended validators
							</Text>
						}{" "}
						<Box w='100%' p={2} mt={6} h='60vh' overflow='auto'>
							{ props.validatorsList && props.validatorsList.map((validator, index) => {
								return (
									<ValidatorTile
										key={index}
										name={validator.name}
										stashId={validator.stashId}
										amount={validator.amount}
										risk={validator.risk}
										currency={props.currency}
										colorMode={props.colorMode}
									/>
								);
							})}
						</Box>
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
						{!props.selectedValidators ?
						<ExpectedReturns
							returns={props.returns}
							currency={props.currency}
						/>
						:
						<ExpectedReturns
							returns={returns}
							currency={props.currency}
						/>
						}
					</Box>
				</Flex>
				<Flex justify='center' py={2}>
					<ButtonGroup spacing={4}>
						<CustomButton 
							variant='secondary'
							onClick={() => {
							history.push('/edit-validators');
							}}
						>
							Edit Validators
						</CustomButton>
						<CustomButton
							onClick={() => {
							history.push('/wallet-connect');
							}}
						>
							Proceed
						</CustomButton>
					</ButtonGroup>
				</Flex>
			</Route>
			<Footer />
		</React.Fragment>
	);
};

export default SuggestedValidators;
