import React from "react";
import Table from "../EditValidators/Table";

type NominatorsTableProps = {
	colorMode?: "light" | "dark",
	currency: string,
	nominators: Array<{}>
};

const NominatorsTable = (props: NominatorsTableProps) => {
	const [nominators, setNominators] = React.useState(props.nominators);

	React.useEffect(() => {
		setNominators(props.nominators);
	}, [props]);

	const mode = props.colorMode ? props.colorMode : "light";

	const sortList = (column, asc) => {
		let tempNominators = [...nominators];
		if (asc) {
			tempNominators = tempNominators.sort((a, b) => a[column] - b[column]);
		} else {
			tempNominators = tempNominators.sort((a, b) => b[column] - a[column]);
		}
		setNominators(tempNominators);
	};

	const parseNominators = nomArr => {
		const parseArr = nomArr.map((nominatorIterator, i) => {
			return {
				id: nominatorIterator.id,
				Nominator: nominatorIterator.Nominator,
				"Total Staked": `${nominatorIterator["Total Staked"]} ${props.currency}`,
				Nominations: nominatorIterator.Nominations,
				"Daily Earnings": `${nominatorIterator["Daily Earnings"]} ${props.currency}`
			};
		});

		console.log(parseArr);
		return parseArr;
	};

	return (
		<Table
			colorMode={mode}
			columns={["Nominator", "Daily Earnings", "Total Staked", "Nominations"]}
			rows={parseNominators(nominators)}
			sortableColumns={["Daily Earnings", "Total Staked", "Nominations"]}
			sortCallback={sortList}
		></Table>
	);
};

export default NominatorsTable;
