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
	const [filteredValidators, setFilteredValidators] = React.useState(validators);
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
	/*
	const [range, setRange] = React.useState();
	
	React.useEffect (() => {

		const filterRange = [];
		filterRange.push(
			{
				label:'Other Stake',
				max: Math.max.apply(Math, validators.map(function(o) { return parseFloat(o['Other Stake']);})),
				min: Math.min.apply(Math, validators.map(function(o) { return parseFloat(o['Other Stake']);})) 
			},
			{
				label:'Own Stake',
				max: Math.max.apply(Math, validators.map(function(o) { return parseFloat(o['Own Stake']);})),
				min: Math.min.apply(Math, validators.map(function(o) { return parseFloat(o['Own Stake']);})) 
			},
			{
				label:'Commission',
				max: Math.max.apply(Math, validators.map(function(o) { return parseFloat(o.Commission);})),
				min: Math.min.apply(Math, validators.map(function(o) { return parseFloat(o.Commission);})) 
			},
			{
				label:'Risk Score',
				max: Math.max.apply(Math, validators.map(function(o) { return parseFloat(o['Risk Score']);}))
			}
		)
		
		props.range(filterRange);
	}, []);
	*/
	React.useEffect(() => {

		const validatorsInfo = validators.filter(val => 
			parseInt(val['Other Stake']) <= props.filters[3].values[1] && 
			parseInt(val['Other Stake']) >= props.filters[3].values[0] &&
			parseInt(val['Own Stake']) <= props.filters[2].values[1] && 
			parseInt(val['Own Stake']) >= props.filters[2].values[0] &&
			parseInt(val.Commission) <= props.filters[4].values[1] && 
			parseInt(val.Commission) >= props.filters[4].values[0] &&
			val['Risk Score'] <= props.filters[6].values[0]/100 
		);
		console.log('val info - ', validatorsInfo)
		setFilteredValidators(validatorsInfo);
	}, [props]);

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
				rows={filteredValidators}
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
