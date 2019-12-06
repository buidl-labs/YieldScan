import React from "react";
import { Table } from "antd";
import { IconButton, useToast } from "@chakra-ui/core";

export default function ValidatorTable(props) {
	const { dataSource } = props;
	const { Column } = Table;
	const toast = useToast();
	return (
		<Table
			rowKey="stashId"
			dataSource={dataSource}
			pagination={false}
		>
			<Column title="Name" key="name" dataIndex="name" align="left" />
			<Column
				title="Daily Earning"
				key="dailyEarning"
				dataIndex="dailyEarning"
				align="left"
				defaultSortOrder="descend"
				sorter={(a, b) =>
					a.dailyEarning.slice(0, -5) - b.dailyEarning.slice(0, -5)
				}
			/>
			<Column
				title="Commission"
				key="commission"
				dataIndex="commission"
				align="left"
			/>
			<Column
				title="Stash Id"
				key="stashIdTruncated"
				dataIndex="stashIdTruncated"
				align="left"
			/>
			<Column
				title="Action"
				key="action"
				render={record => (
					<IconButton
						ml={4}
						icon="copy"
						onClick={() => {
							navigator.clipboard.writeText(record.stashId).then(
								() =>
									toast({
										title: "Validator Address Copied",
										description: `The Stash Id of ${record.name} has been copied to your clipboard`,
										status: "success",
										duration: 5000,
										isClosable: true
									}),
								() => console.log(`Something went wrong`)
							);
						}}
					/>
				)}
			/>
		</Table>
	);
}
