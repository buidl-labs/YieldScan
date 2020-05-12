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
import { textColor, textColorLight } from "../../constants";

type EditValidatorsProps = {
	colorMode?: "light" | "dark",
	amount: float,
	currency: string,
	validatorsList: Array<{
		name: string,
		stashId: string,
		amount: float,
		risk: float,
		commission: string,
		stashId: string,
		amount: float
	}>
};

const EditValidators = (props: EditValidatorsProps) => {
	console.log ('props - ', props);

	const [validators, setValidators] = React.useState(
		props.validatorsList && props.validatorsList.reduce((acc, cur) => {
			acc.push({
				Validator: cur.name,
				Commission: cur.commission,
				'Risk Score': cur.risk,
				selected: true,
				stashId: cur.stashId,
				amount: cur.amount
			});
			return acc;
		}, [])
		/* {
			Validator: "PolyLabs I",
			"Other Stake": "13.4525 KSM",
			"Own Stake": "13 KSM",
			Commission: "4%",
			"Risk Score": 0.34,
			selected: true
		} */
	);

	const mode = props.colorMode ? props.colorMode : "light";

	const callBack = i => {
		const temp = [...validators];
		temp[i].selected = temp[i].selected ? !temp[i].selected : true;
		setValidators(temp);
	};

	const selectAll = bool => {
		setValidators(
			validators.map((doc, i) => {
				return { ...doc, selected: bool };
			})
		);
	};

	const sortList = (column, asc) => {
		let tempValidators = [...validators];
		if (asc) {
			tempValidators = tempValidators.sort((a, b) =>
				a[column] > b[column] ? 1 : b[column] > a[column] ? -1 : 0
			);
		} else {
			tempValidators = tempValidators.sort((a, b) =>
				a[column] > b[column] ? -1 : b[column] > a[column] ? 1 : 0
			);
		}
		setValidators(tempValidators);
	};

	const handleValidators = () => {
		const validatorsInfo = validators && validators.filter(({selected}) => selected ===true).reduce((acc, cur) => {
			acc.push ({
				name:cur.Validator,
				risk: "0.22",
				commission: cur.Commission,
				stashId: cur.stashId,
				amount: cur.amount
			});
			return acc;
		}, [])
		console.log ('validators - ', validatorsInfo);
	}

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
									"Other Stake",
									"Own Stake",
									"Commission",
									"Risk Score"
								]}
								rows={validators}
								selectCallback={callBack}
								selectAllCallback={selectAll}
								sortableColumns={[
									"Other Stake",
									"Own Stake",
									"Commission",
									"Risk Score"
								]}
								sortCallback={sortList}
							></Table>
						</Box>
					</Box>
					<Flex justify='center' mt={4} py={4}>
						<ButtonGroup spacing={4}>
							<CustomButton
								onClick={handleValidators}
							>
								Proceed
							</CustomButton>
						</ButtonGroup>
					</Flex>
				</Box>
			</Route>
			<Footer />
		</>
	);
};

export default EditValidators;
