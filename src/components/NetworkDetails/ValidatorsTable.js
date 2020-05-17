import React from "react";
import Table from "../EditValidators/Table";

type ValidatorsTableProps = {
	colorMode?: "light" | "dark",
	currency: string,
	filters?: Array<{}>
};

// TODO: Improve filtering logic implementation

const ValidatorsTable = (props: ValidatorsTableProps) => {
	const [validators, setValidators] = React.useState([]);

	const parseValidators = valArr => {
		const parseArr = [];
		valArr.map((doc, i) => {
			parseArr.push({
				Validator: doc.Validator,
				"No. of Nominators": doc["No. of Nominators"],
				"Other Stake": `${doc["Other Stake"]} ${props.currency}`,
				"Own Stake": `${doc["Own Stake"]} ${props.currency}`,
				Commission: `${doc.Commission}%`,
				"Risk Score": doc["Risk Score"]
			});
		});
		console.log(`\nparseArr: ${JSON.stringify(valArr, null, 4)}`);
		return parseArr;
	};

	const mode = props.colorMode ? props.colorMode : "light";
	const [filteredValidators, setFilteredValidators] = React.useState(
		validators
	);
	const sortList = (column, asc) => {
		let tempValidators = [...validators];
		if (asc) {
			tempValidators = tempValidators.sort((a, b) => a[column] - b[column]);
		} else {
			tempValidators = tempValidators.sort((a, b) => b[column] - a[column]);
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
			validators.filter(val =>
				isInRange({
					num: val["No. of Nominators"],
					range: props.filters[0].values,
					type: "range"
				}) &&
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
				isNaN(parseFloat(val["Risk Score"] * 100))
					? true
					: isInRange({
							num: parseFloat(val["Risk Score"] * 100),
							range: props.filters[4].values,
							type: "slider",
							belowValue: true
					  })
			);
		setFilteredValidators(validatorsInfo);
	}, [props, validators]);
	React.useEffect(() => {
		if (validators.length > 0) {
			changeFilterRange();
		}
	}, [validators]);
	React.useEffect(() => {
		setValidators(props.validators);
	}, [props.validators]);

	return (
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
	);
};

export default ValidatorsTable;
