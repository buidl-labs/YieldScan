import React from "react";
import Table from "../EditValidators/Table";

type NominatorsTableProps = {
	colorMode?: "light" | "dark",
	currency: string,
	nominators: Array<{
	}>
};

const NominatorsTable = (props: NominatorsTableProps) => {
	const [nominators, setNominators] = React.useState(props.nominators);

	React.useEffect ( () => {
		setNominators(props.nominators);
	}, [props])

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
				columns={["Nominator", "Total Stake", "Backers"]}
				rows={nominators}
				sortableColumns={["Nominator", "Total Stake", "Backers"]}
				sortCallback={sortList}
			></Table>
		</>
	);
};

export default NominatorsTable;
