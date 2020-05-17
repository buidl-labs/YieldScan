import React from "react";
import Table from "../EditValidators/Table";

type ValidatorsTableProps = {
	colorMode?: "light" | "dark",
	currency: string,
	filters?: Array<{}>
};

const ValidatorsTable = (props: ValidatorsTableProps) => {
	const [validators, setValidators] = React.useState([
		{
			Validator: "PolyLabs I",
			"No. of Nominators": 300,
			"Other Stake": 10.4525,
			"Own Stake": 13,
			Commission: 4,
			"Risk Score": 0.34
		},
		{
			Validator: "PolyLabs I",
			"No. of Nominators": 50,
			"Other Stake": 1.4525,
			"Own Stake": 33,
			Commission: 4,
			"Risk Score": 0.04
		},
		{
			Validator: "PolyLabs I",
			"No. of Nominators": 150,
			"Other Stake": 13.4525,
			"Own Stake": 103,
			Commission: 5,
			"Risk Score": 0.64
		},
		{
			Validator: "PolyLabs I",
			"No. of Nominators": 2000,
			"Other Stake": 3.4525,
			"Own Stake": 3,
			Commission: 7,
			"Risk Score": 0.7
		},
		{
			Validator: "PolyLabs I",
			"No. of Nominators": 4750,
			"Other Stake": 22.4525,
			"Own Stake": 1003,
			Commission: 18,
			"Risk Score": 0.3
		},
		{
			Validator: "PolyLabs I",
			"No. of Nominators": 42,
			"Other Stake": 1345.25,
			"Own Stake": 4242,
			Commission: 2,
			"Risk Score": 0.14
		},
		{
			Validator: "PolyLabs I",
			"No. of Nominators": 7,
			"Other Stake": 525,
			"Own Stake": 1600,
			Commission: 19,
			"Risk Score": 0.24
		}
	]);

	const parseValidators = valArr => {
		let parseArr = [];
		valArr.map((doc, i) => {
			parseArr.push({
				Validator: doc["Validator"],
				"No. of Nominators": doc["No. of Nominators"],
				"Other Stake": `${doc["Other Stake"]} ${props.currency}`,
				"Own Stake": `${doc["Own Stake"]} ${props.currency}`,
				Commission: `${doc["Commission"]}%`,
				"Risk Score": doc["Risk Score"]
			});
		});
		return parseArr;
	};

	const mode = props.colorMode ? props.colorMode : "light";
	const [filteredValidators, setFilteredValidators] = React.useState(
		validators
	);
	const sortList = (column, asc) => {
		let tempValidators = [...validators];
		if (asc) {
			tempValidators = tempValidators.sort((a, b) => {
				const logger = a[column] - b[column];
				return logger;
			});
		} else {
			tempValidators = tempValidators.sort((a, b) => {
				const logger = b[column] - a[column];
				return logger;
			});
		}
		setValidators(tempValidators);
	};
	const isInRange = ({ num, range, type, belowValue }) => {
		let inRange = false;
		if (type === "range") {
			inRange = num <= Math.max(...range) && num >= Math.min(...range);
		} else if (type === "slider") {
			inRange = belowValue ? num <= range[0] : num >= range[0];
		}
		return inRange;
	};

	const setFilterRange = (index, val) => {
		const temp = [...props.filters];
		temp[index].values = [Math.floor(val.min), Math.ceil(val.max)];
		temp[index].min = Math.floor(val.min);
		temp[index].max = Math.ceil(val.max);
		console.log(temp);
		props.setFilters(temp);
	};

	const getValidatorDataRange = property => {
		const min = Math.min(...validators.map(val => val[property]));
		const max = Math.max(...validators.map(val => val[property]));

		return { min, max };
	};

	const changeFilterRange = () => {
		props.filters.forEach((filter, index) => {
			filter.label === "Commission" || filter.label === "Max. Risk Level"
				? console.log("commission or risk level skipped")
				: setFilterRange(index, getValidatorDataRange(filter.label));
		});
	};

	React.useEffect(() => {
		const validatorsInfo =
			validators &&
			validators.filter(
				val =>
					isInRange({
						num: val["No. of Nominators"],
						range: props.filters[0].values,
						type: "range"
					}) 
					&&
					isInRange({
						num: parseFloat(val["Own Stake"]),
						range: props.filters[1].values,
						type: "range"
					}) &&
					isInRange({
						num: parseFloat(val["Other Stake"]),
						range: props.filters[2].values,
						type: "range"
					}) &&
					isInRange({
						num: parseFloat(val.Commission),
						range: props.filters[3].values,
						type: "range"
					}) &&
					isInRange({
						num: parseFloat(val["Risk Score"] * 100),
						range: props.filters[4].values,
						type: "slider",
						belowValue: true
					})
			);
		setFilteredValidators(validatorsInfo);
	}, [props, validators]);
	React.useEffect(() => {
		changeFilterRange();
	}, []);

	return (
		<>
			<Table
				colorMode={mode}
				columns={[
					"Validator",
					"No. of Nominators",
					"Other Stake",
					"Own Stake",
					"Commission",
					"Risk Score"
				]}
				rows={parseValidators(filteredValidators)}
				sortableColumns={[
					"No. of Nominators",
					"Other Stake",
					"Own Stake",
					"Commission",
					"Risk Score"
				]}
				sortCallback={sortList}
			></Table>
		</>
	);
};

export default ValidatorsTable;
