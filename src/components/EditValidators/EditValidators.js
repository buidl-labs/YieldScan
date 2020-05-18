import React from "react";
import { useHistory, Route, Link } from "react-router-dom";
import { Box, Heading, Text, Icon, ButtonGroup, Flex } from "@chakra-ui/core";
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
		Validator: string,
		stashId: string,
		amount: float,
		"Risk Score": float,
		Commission: string,
		"Own Stake": float,
		"Other Stake": float
	}>,
	validatorTableData: Array<{}>
};

const EditValidators = (props: EditValidatorsProps) => {
	const history = useHistory();

	const [validators, setValidators] = React.useState();

	React.useEffect(() => {
		const validatorTableData =
			props.validatorTableData &&
			props.validatorTableData.reduce((acc, cur) => {
				acc.push({
					Validator: cur.Validator,
					Commission: cur.Commission,
					"Risk Score": cur["Risk Score"],
					predictedPoolReward: cur.predictedPoolReward,
					totalStake: cur.totalStake,
					stashId: cur.stashId,
					"Own Stake": cur["Own Stake"],
					"Other Stake": cur["Other Stake"],
					selected: false,
					amount: 0
				});
				return acc;
			}, []);
		const validatorsList =
			props.validatorsList &&
			props.validatorsList.reduce((acc, cur) => {
				acc.push({
					Validator: cur.Validator,
					stashId: cur.stashId,
					amount: props.amount / props.validatorsList.length,
					predictedPoolReward: props.validatorTableData.find(
						validator => validator.stashId === cur.stashId
					).predictedPoolReward,
					totalStake: props.validatorTableData.find(
						validator => validator.stashId === cur.stashId
					).totalStake,
					"Risk Score": cur["Risk Score"],
					Commission: cur.Commission,
					"Own Stake": cur["Own Stake"],
					"Other Stake": cur["Other Stake"],
					selected: true
				});
				return acc;
			}, []);

		const jointArray = combineTwoArrays([
			...validatorTableData,
			...validatorsList
		]);
		jointArray.sort((a, b) => (a.selected < b.selected ? 1 : -1));
		setValidators(jointArray);
	}, [props.amount, props.validatorTableData, props.validatorsList]);

	const mode = props.colorMode ? props.colorMode : "light";

	const callBack = i => {
		const temp = [...validators];
		temp[i].selected = temp[i].selected ? !temp[i].selected : true;
		setValidators(temp);
	};

	const selectAll = bool => {
		setValidators(
			validators &&
				validators.map((doc, i) => {
					return { ...doc, selected: bool };
				})
		);
	};

	const sortList = (column, asc) => {
		let tempValidators = [...validators];
		if (asc) {
			tempValidators = tempValidators.sort((a, b) => a[column] - b[column]);
		} else {
			tempValidators = tempValidators.sort((a, b) => b[column] - a[column]);
		}
		setValidators(tempValidators);
	};

	const handleValidators = () => {
		const updatedStakingAmount =
			props.amount /
			validators.filter(validator => {
				return validator.selected;
			}).length;
		const validatorsInfo =
			validators &&
			validators
				.filter(({ selected }) => selected === true)
				.reduce((acc, cur) => {
					acc.push({
						Validator: cur.Validator,
						"Risk Score": cur["Risk Score"],
						Commission: cur.Commission,
						stashId: cur.stashId,
						amount: updatedStakingAmount
					});
					return acc;
				}, []);

		props.selectedValidators(validatorsInfo);
		props.setValidators(validatorsInfo);
		history.push("/suggested-validators");
	};

	const parseValidators = valArr => {
		const parseArr = [];
		valArr.map((doc, i) => {
			parseArr.push({
				Validator: doc.Validator,
				"No. of Nominators": doc["No. of Nominators"],
				"Other Stake": `${doc["Other Stake"]} ${props.currency}`,
				"Own Stake": `${doc["Own Stake"]} ${props.currency}`,
				Commission: `${doc.Commission}%`,
				"Risk Score": doc["Risk Score"],
				selected: doc.selected
			});
		});
		return parseArr;
	};

	return (
		<>
			<Helmet>
				<title>Yield Scan &middot; Edit Validators</title>
			</Helmet>
			<Route exact path='/edit-validators'>
				<Box m={0} my={10}>
					<Link to={"/suggested-validators"} m={0}>
						<Icon name='arrow-back' mr={1} /> {!props.isSelected ? "Suggested Validators" : "Selected Validators"}
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
						{validators &&
							validators.filter(doc => {
								return doc.selected === true;
							}).length}{" "}
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
								rows={validators && parseValidators(validators)}
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
							<CustomButton onClick={handleValidators}>Proceed</CustomButton>
						</ButtonGroup>
					</Flex>
				</Box>
			</Route>
			<Footer />
		</>
	);
};

export default EditValidators;

const combineTwoArrays = (...arrays) => {
	let jointArray = [];

	arrays.forEach(array => {
		jointArray = [...jointArray, ...array];
	});

	const newArray = [];
	const uniqueObject = [];
	let objStashId;

	for (const i in jointArray) {
		if (Object.prototype.hasOwnProperty.call(jointArray, i)) {
			objStashId = jointArray[i].stashId;
			uniqueObject[objStashId] = jointArray[i];
		}
	}

	for (const i in uniqueObject) {
		if (Object.prototype.hasOwnProperty.call(uniqueObject, i)) {
			newArray.push(uniqueObject[i]);
		}
	}

	return newArray;
};
