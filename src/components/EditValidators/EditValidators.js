import React from "react";
import { useHistory, Route } from "react-router-dom";
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
		amount: float,
		dailyEarningPrecise: float
	}>,
	validatorTableData: Array<{
	}>
};

function combineTwoArrays (...arrays) {
	let jointArray = []
	
	arrays.forEach(array => {
		jointArray = [...jointArray, ...array]
	})

	const newArray = [];
	const uniqueObject = [];
	let objStashId;

	for (const i in jointArray) {
		objStashId = jointArray[i].stashId;
		uniqueObject[objStashId] = jointArray[i];
	}
	
	for (const i in uniqueObject) {
		newArray.push(uniqueObject[i]);
	}

	return newArray;

}

const EditValidators = (props: EditValidatorsProps) => {
	const history = useHistory();

	const [validators, setValidators] = React.useState();
		
	React.useEffect (() => {
		const validatorTableData = props.validatorTableData && props.validatorTableData.reduce((acc, cur) => {
			acc.push({
				Validator: cur.name,
				Commission: cur.commission,
				'Risk Score': '0.22',
				selected: false,
				stashId: cur.stashId,
				amount: 0,
				dailyEarningPrecise:cur.dailyEarningPrecise
			});
			return acc;
		}, []);
		
		const validatorsList = props.validatorsList && props.validatorsList.reduce((acc, cur) => {
			acc.push({
				Validator: cur.name,
				Commission: cur.commission,
				'Risk Score': cur.risk,
				selected: true,
				stashId: cur.stashId,
				amount: cur.amount,
				dailyEarningPrecise:cur.dailyEarningPrecise
			});
			return acc;
		}, []);

		const jointArray = combineTwoArrays([...validatorTableData, ...validatorsList]);
		jointArray.sort((a, b) => (a.selected < b.selected) ? 1: -1);
		setValidators(jointArray);
	}, []);
	
	const mode = props.colorMode ? props.colorMode : "light";

	const callBack = i => {
		const temp = [...validators];
		temp[i].selected = temp[i].selected ? !temp[i].selected : true;
		setValidators(temp);
	};

	const selectAll = bool => {
		setValidators(
			validators && validators.map((doc, i) => {
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
		let validatorsInfo = validators && validators.filter(({selected}) => selected ===true).reduce((acc, cur) => {
			acc.push ({
				name:cur.Validator,
				risk: "0.22",
				commission: cur.Commission,
				stashId: cur.stashId,
				amount: cur.amount,
				dailyEarningPrecise:cur.dailyEarningPrecise
			});
			return acc;
		}, [])
		const updatedStakingAmount = props.amount / validatorsInfo.length;
		validatorsInfo = validatorsInfo && validatorsInfo.reduce((acc, cur) => {
			acc.push ({
				name:cur.name,
				risk: cur.risk,
				commission: cur.commission,
				stashId: cur.stashId,
				amount: updatedStakingAmount,
				dailyEarningPrecise:cur.dailyEarningPrecise
			});
			return acc;
		}, [])
		props.selectedValidators(true);
		props.onEvent(validatorsInfo);
		history.push('/suggested-validators');

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
							validators && validators.filter(doc => {
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
