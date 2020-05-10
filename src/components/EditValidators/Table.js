import React from "react";
import {
	Box,
	Grid,
	Text,
	Checkbox,
	Flex,
	Badge,
	Tooltip
} from "@chakra-ui/core";
import {
	textColor,
	textColorLight,
	border,
	getRiskLevelColor
} from "../../constants";

const deselect = {
	light: "#F9FBFF",
	dark: "#212937"
};

type TableProps = {
	colorMode?: colorMode,
	columns: Array<string>,
	rows: Array<Object>,
	allowRowSelect?: Boolean,
	columnsTemplate?: string,
	selectCallback?: Number => void,
	selectAllCallback?: Boolean => void
};

const Table = (props: TableProps) => {
	const [selectAll, setSelectAll] = React.useState(false);

	const mode = props.colorMode ? props.colorMode : "light";
	let columnTemplate = props.columnsTemplate
		? props.columnsTemplate
		: props.allowRowSelect
		? `50px repeat(${props.columns.length}, 1fr)`
		: `repeat(${props.columns.length}, 1fr)`;

	return (
		<>
			<Box w='100%' h='100%' overflow='auto'>
				<Grid
					w='100%'
					templateColumns={columnTemplate}
					gap={0}
					borderWidth='1px'
					borderColor={border[mode]}
					roundedTopLeft='lg'
					roundedTopRight='lg'
					boxShadow='0 0 25px rgba(0,0,0,.1)'
				>
					{props.allowRowSelect && (
						<Tooltip
							label={selectAll ? "Deselect All" : "Select All"}
							placement='bottom'
							hasArrow
						>
							<Flex
								w='100% - 10px'
								px='10px'
								py={4}
								align='center'
								justify='center'
							>
								<Checkbox
									size='lg'
									variantColor='teal'
									isChecked={selectAll}
									onChange={e => {
										setSelectAll(!selectAll);
										props.selectAllCallback(!selectAll);
									}}
								></Checkbox>
							</Flex>
						</Tooltip>
					)}
					{props.columns.map((col, index) => {
						return (
							<Box w='calc(100% - 10px)' p='10px' key={index}>
								<Text as='b' fontSize='sm' color={textColor[mode]}>
									{col}
								</Text>
							</Box>
						);
					})}
				</Grid>
				{props.rows.map((row, index) => {
					return (
						<Grid
							key={index}
							templateColumns={columnTemplate}
							gap={0}
							borderWidth='1px'
							borderColor={border[mode]}
							borderTop='0'
							bg={row.selected ? "rgba(255,255,255,0)" : deselect[mode]}
						>
							{props.allowRowSelect && (
								<Flex
									w='100% - 10px'
									px='10px'
									py={4}
									align='center'
									justify='center'
								>
									<Checkbox
										size='lg'
										key={"Check" + index}
										variantColor='teal'
										isChecked={row.selected}
										onChange={e => {
											if (row.selected) {
												setSelectAll(false);
											}
											props.selectCallback(index);
										}}
									></Checkbox>
								</Flex>
							)}
							{props.columns.map((col, i) => {
								return (
									<Box w='calc(100% - 10px)' px='10px' py={4} key={i}>
										{col === "Risk Score" ? (
											<Text fontSize='sm'>
												<Badge variantColor={getRiskLevelColor(row[col])}>
													{row[col]}
												</Badge>
											</Text>
										) : (
											<Text
												fontSize='sm'
												color={textColorLight[mode]}
												as={col === "Validator" ? "b" : "p"}
											>
												{row[col]}
											</Text>
										)}
									</Box>
								);
							})}
						</Grid>
					);
				})}
			</Box>
		</>
	);
};

export default Table;
