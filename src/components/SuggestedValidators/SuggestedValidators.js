import React from "react";
import { useHistory, Route, Link } from "react-router-dom";
import { Box, Heading, Flex, Text, ButtonGroup, Icon } from "@chakra-ui/core";
import Helmet from "react-helmet";
import { isWeb3Injected } from "@polkadot/extension-dapp";
import Footer from "../Footer.jsx";
import ValidatorTile from "./ValidatorTile";
import ExpectedReturns from "./ExpectedReturns";
import CustomButton from "../CustomButton";
import Auth from "../Auth";
import { calculateRewards } from "./suggestions.js";

type SuggestedValidatorsProps = {
	colorMode: "light" | "dark",
	validatorsList: Array<{
		Validator: string,
		stashId: string,
		amount: float,
		"Risk Score": float | string
	}>,
	returns: float,
	budget: float,
	currency: string,
	selectedValidators: boolean
};

const SuggestedValidators = (props: SuggestedValidatorsProps) => {
	const history = useHistory();
	const [returns, setReturns] = React.useState(0.0);
	React.useEffect(() => {
		const result =
			props.validatorsList &&
			props.validatorsList.reduce((acc, cur) => {
				const predictedReward = isNaN(cur.predictedPoolReward)
					? 0
					: calculateRewards(cur.amount, cur);
				return acc + predictedReward;
			}, 0);
		setReturns(result);
	}, [props, returns]);

	return (
		<React.Fragment>
			<Helmet>
				<title>
					Yield Scan &middot;{" "}
					{!props.selectedValidators
						? "Suggested Validators"
						: "Selected Validators"}
				</title>
			</Helmet>
			<Route exact path='/suggested-validators'>
				<Box m={4} mt={10}>
					{!props.selectedValidators ? (
						<Link
							onClick={() => {
								Auth.logout(() => {
									history.push("/returns-calculator");
								});
							}}
						>
							<Icon name='arrow-back' mr={1} />
							Returns Calculator
						</Link>
					) : (
						<Link
							onClick={() => {
								history.push("/edit-validators");
							}}
						>
							<Icon name='arrow-back' mr={1} />
							Edit Validators
						</Link>
					)}
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
						{!props.selectedValidators ? (
							<Heading>Suggested Validators</Heading>
						) : (
							<Heading>Selected Validators</Heading>
						)}
						{
							<Text>
								Staking a budget of {props.budget} {props.currency} to{" "}
								{props.validatorsList && props.validatorsList.length}{" "}
								recommended validators
							</Text>
						}{" "}
						<Box w='100%' p={2} mt={6} h='60vh' overflow='auto'>
							{props.validatorsList &&
								props.validatorsList.map((validator, index) => {
									return (
										<ValidatorTile
											key={index}
											name={validator.Validator}
											stashId={validator.stashId}
											amount={props.budget / props.validatorsList.length}
											risk={validator["Risk Score"]}
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
						{!props.selectedValidators ? (
							<ExpectedReturns
								returns={props.returns}
								currency={props.currency}
							/>
						) : (
							<ExpectedReturns returns={returns} currency={props.currency} />
						)}
					</Box>
				</Flex>
				<Flex justify='center' py={2}>
					<ButtonGroup spacing={4}>
						<CustomButton
							variant='secondary'
							onClick={() => {
								history.push("/edit-validators");
							}}
						>
							Edit Validators
						</CustomButton>
						<CustomButton
							onClick={() => {
								isWeb3Injected && history.push("/confirmation");
								!isWeb3Injected && history.push("/wallet-connect");
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
