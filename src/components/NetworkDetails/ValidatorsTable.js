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
			"No. of Nominations": 300,
			"Other Stake": 10.4525,
			"Own Stake": 13,
			Commission: 4,
			"Risk Score": 0.34
		},
		{
			Validator: "PolyLabs I",
			"No. of Nominations": 50,
			"Other Stake": 1.4525,
			"Own Stake": 33,
			Commission: 4,
			"Risk Score": 0.04
		},
		{
			Validator: "PolyLabs I",
			"No. of Nominations": 150,
			"Other Stake": 13.4525,
			"Own Stake": 103,
			Commission: 5,
			"Risk Score": 0.64
		},
		{
			Validator: "PolyLabs I",
			"No. of Nominations": 2000,
			"Other Stake": 3.4525,
			"Own Stake": 3,
			Commission: 7,
			"Risk Score": 0.7
		},
		{
			Validator: "PolyLabs I",
			"No. of Nominations": 4750,
			"Other Stake": 22.4525,
			"Own Stake": 1003,
			Commission: 18,
			"Risk Score": 0.3
		},
		{
			Validator: "PolyLabs I",
			"No. of Nominations": 42,
			"Other Stake": 1345.25,
			"Own Stake": 4242,
			Commission: 2,
			"Risk Score": 0.14
		},
		{
			Validator: "PolyLabs I",
			"No. of Nominations": 7,
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
				"No. of Nominations": doc["No. of Nominations"],
				"Other Stake": `${doc["Other Stake"]} ${props.currency}`,
				"Own Stake": `${doc["Own Stake"]} ${props.currency}`,
				Commission: `${doc["Commission"]}%`,
				"Risk Score": doc["Risk Score"]
			});
		});
		return parseArr;
	};

	const mode = props.colorMode ? props.colorMode : "light";

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

	return (
		<>
			<Table
				colorMode={mode}
				columns={[
					"Validator",
					"No. of Nominations",
					"Other Stake",
					"Own Stake",
					"Commission",
					"Risk Score"
				]}
				rows={parseValidators(validators)}
				sortableColumns={[
					"No. of Nominations",
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
