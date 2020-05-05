import React from "react";
import { Route } from "react-router-dom";
import {
	Box,
	Heading,
	Flex,
	Text,
	ButtonGroup,
	Link,
	Icon
} from "@chakra-ui/core";
import Helmet from "react-helmet";
import Footer from "../Footer.jsx";
import ValidatorTile from "./ValidatorTile";
import ExpectedReturns from "./ExpectedReturns";
import CustomButton from "../CustomButton";

type SuggestedValidatorsProps = {
	colorMode: string,
	validatorsList: Array<{
		name: string,
		avatar?: string,
		amount: float,
		risk: float
	}>
};

const SuggestedValidators = (props: SuggestedValidatorsProps) => {
	return (
		<React.Fragment>
			<Helmet>
				<title>Suggested Validators</title>
			</Helmet>
			<Route exact path='/suggested-validators'>
				<Box m={4} mt={10}>
					<Link m={4}>
						<Icon name='arrow-back' mr={1} /> Returns Calculator
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
						<Text>Staking a budget of x KSM to 16 recommended validators</Text>
						<Box w='100%' p={2} mt={6} h='60vh' overflow='auto'>
							{props.validatorsList.map((validator, index) => {
								return (
									<ValidatorTile
										name={validator.name}
										amount={validator.amount}
										risk={validator.risk}
										avatar={validator.avatar}
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
						<ExpectedReturns />
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
