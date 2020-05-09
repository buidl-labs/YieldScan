import React from "react";
import { useHistory, Redirect, Route, Link } from "react-router-dom";
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
		risk: float
	}>,
	returns: float,
	budget: float,
	currency: string,
};

const SuggestedValidators = (props: SuggestedValidatorsProps) => {
	const history = useHistory();
	
	return (
		<React.Fragment>
			<Helmet>
				<title>Yield Scan &middot; Suggested Validators</title>
			</Helmet>
			<Route exact path='/suggested-validators'>
				<Box m={4} mt={10}>
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
						<Heading>Suggested Validators</Heading>
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
						<ExpectedReturns
							returns={props.returns}
							currency={props.currency}
						/>
					</Box>
				</Flex>
				<Flex justify='center' py={2}>
					<ButtonGroup spacing={4}>
						<CustomButton variant='secondary'>Edit Validators</CustomButton>
						<CustomButton>Proceed</CustomButton>
					</ButtonGroup>
				</Flex>
			</Route>
			<Footer />
		</React.Fragment>
	);
};

export default SuggestedValidators;
