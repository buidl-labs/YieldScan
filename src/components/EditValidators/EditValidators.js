import React from "react";
import { Route } from "react-router-dom";
import {
	Box,
	Heading,
	Text,
	Link,
	Icon,
	ButtonGroup,
	Flex
} from "@chakra-ui/core";
import Helmet from "react-helmet";
import Footer from "../Footer.jsx";
import Table from "./Table";
import CustomButton from "../CustomButton";
import { textColor, textColorLight, border } from "../../constants";

type EditValidatorsProps = {
	colorMode?: "light" | "dark",
	amount: float,
	currency: string
};

const EditValidators = (props: EditValidatorsProps) => {
	const [validators, setValidators] = React.useState([
		{
			Validator: "PolyLabs I",
			"Staking Amt.": "13.4525 KSM",
			"Other Stake": "13.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "3%",
			Points: "220",
			"Risk Score": 0.34,
			selected: true
		},
		{
			Validator: "PolyLabs I",
			"Staking Amt.": "13.4525 KSM",
			"Other Stake": "13.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "3%",
			Points: "220",
			"Risk Score": 0.1,
			selected: true
		},
		{
			Validator: "PolyLabs I",
			"Staking Amt.": "13.4525 KSM",
			"Other Stake": "13.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "3%",
			Points: "220",
			"Risk Score": 0.7,
			selected: true
		},
		{
			Validator: "PolyLabs I",
			"Staking Amt.": "13.4525 KSM",
			"Other Stake": "13.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "3%",
			Points: "220",
			"Risk Score": 0.7,
			selected: true
		},
		{
			Validator: "PolyLabs I",
			"Staking Amt.": "13.4525 KSM",
			"Other Stake": "13.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "3%",
			Points: "220",
			"Risk Score": 0.7,
			selected: true
		},
		{
			Validator: "PolyLabs I",
			"Staking Amt.": "13.4525 KSM",
			"Other Stake": "13.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "3%",
			Points: "220",
			"Risk Score": 0.7,
			selected: true
		}
	]);

	const mode = props.colorMode ? props.colorMode : "light";

	const callBack = i => {
		console.log(i);
		let temp = [...validators];
		temp[i]["selected"] = temp[i]["selected"] ? !temp[i]["selected"] : true;
		setValidators(temp);
		console.log(validators);
	};

	const selectAll = bool => {
		setValidators(
			validators.map((doc, i) => {
				return { ...doc, selected: bool };
			})
		);
	};

	return (
		<>
			<Helmet>
				<title>Yield Scan &middot; Edit Validators</title>
			</Helmet>
			<Route exact path='/edit-validators'>
				<Box m={0} my={10}>
					<Link to='/suggested-validators' m={0}>
						<Icon name='arrow-back' mr={1} /> Suggested Validators
					</Link>
				</Box>
				<Box w='100%'>
					<Heading as='h3' size='xl' color={textColor[mode]}>
						Edit Validators
					</Heading>
					<Text color={textColorLight[mode]}>
						Staking a budget of{" "}
						<b>
							{props.amount} {props.currency}
						</b>{" "}
						to{" "}
						{
							validators.filter(doc => {
								return doc.selected === true;
							}).length
						}{" "}
						validators
					</Text>
					<Box w='100%' mt={8} overflow='auto'>
						<Box w={["300%", "200%", "100%", "100%"]}>
							<Table
								colorMode={mode}
								allowRowSelect={true}
								columns={[
									"Validator",
									"Staking Amt.",
									"Other Stake",
									"Own Stake",
									"Commission",
									"Points",
									"Risk Score",
									"Last #"
								]}
								rows={validators}
								selectCallback={callBack}
								selectAllCallback={selectAll}
							></Table>
						</Box>
					</Box>
					<Flex justify='center' mt={4} py={4}>
						<ButtonGroup spacing={4}>
							<CustomButton>Proceed</CustomButton>
						</ButtonGroup>
					</Flex>
				</Box>
			</Route>
			<Footer />
		</>
	);
};

export default EditValidators;
