import React from "react";
import Table from "../EditValidators/Table";

type NominatorsTableProps = {
	colorMode?: "light" | "dark",
	currency: string
};

const NominatorsTable = (props: NominatorsTableProps) => {
	const [nominators, setNominators] = React.useState([
		{
			"Column 1": "Sample Name Value 1",
			"Column 2": "Sample Numbers 042",
			"Column 3": "Sample Text Desc"
		}
	]);

	const mode = props.colorMode ? props.colorMode : "light";

	const sortList = (column, asc) => {
		let tempNominators = [...nominators];
		if (asc) {
			tempNominators = tempNominators.sort((a, b) =>
				a[column] > b[column] ? 1 : b[column] > a[column] ? -1 : 0
			);
		} else {
			tempNominators = tempNominators.sort((a, b) =>
				a[column] > b[column] ? -1 : b[column] > a[column] ? 1 : 0
			);
		}
		setNominators(tempNominators);
	};

	return (
		<>
			<Table
				colorMode={mode}
				columns={["Column 1", "Column 2", "Column 3"]}
				rows={nominators}
				sortableColumns={["Column 1", "Column 2", "Column 3"]}
				sortCallback={sortList}
			></Table>
		</>
	);
};

export default NominatorsTable;
