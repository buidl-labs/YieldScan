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
			"Other Stake": "13.4525 KSM",
			"Own Stake": "13 KSM",
			Commission: "4%",
			"Risk Score": 0.34
		},
		{
			Validator: "PolyLabs I",
			"Other Stake": "13.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "5%",
			"Risk Score": 0.14
		},
		{
			Validator: "PolyLabs I",
			"Other Stake": "124.4525 KSM",
			"Own Stake": "15 KSM",
			Commission: "3%",
			"Risk Score": 0.22
		},
		{
			Validator: "PolyLabs I",
			"Other Stake": "13.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "2%",
			"Risk Score": 0.15
		},
		{
			Validator: "PolyLabs I",
			"Other Stake": "53.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "3%",
			"Risk Score": 0.64
		},
		{
			Validator: "PolyLabs I",
			"Other Stake": "53.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "3%",
			"Risk Score": 0.64
		},
		{
			Validator: "PolyLabs I",
			"Other Stake": "53.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "3%",
			"Risk Score": 0.64
		},
		{
			Validator: "PolyLabs I",
			"Other Stake": "53.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "3%",
			"Risk Score": 0.64
		},
		{
			Validator: "PolyLabs I",
			"Other Stake": "53.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "3%",
			"Risk Score": 0.64
		},
		{
			Validator: "PolyLabs I",
			"Other Stake": "53.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "3%",
			"Risk Score": 0.64
		},
		{
			Validator: "PolyLabs I",
			"Other Stake": "53.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "3%",
			"Risk Score": 0.64
		},
		{
			Validator: "PolyLabs I",
			"Other Stake": "53.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "3%",
			"Risk Score": 0.64
		},
		{
			Validator: "PolyLabs I",
			"Other Stake": "53.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "3%",
			"Risk Score": 0.64
		}
	]);

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
					"Other Stake",
					"Own Stake",
					"Commission",
					"Risk Score"
				]}
				rows={validators}
				sortableColumns={[
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
