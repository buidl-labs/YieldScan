import React from "react";
import { Box, Text, Flex } from "@chakra-ui/core";
import { textColor, textColorLight, border } from "../../constants";
import RangeInput from "./RangeInput";

type FilterProps = {
	colorMode?: "light" | "dark",
	filters: Array<{
		label: string,
		type: "slider" | "range" | "input",
		values: any,
		min: number,
		max: Number
	}>,
	callback: Array => void
};

const Filter = (props: FilterProps) => {
	const mode = props.colorMode ? props.colorMode : "light";

	const changeValues = (ind, newVal) => {
		const temp = [...props.filters];
		temp[ind].values = newVal;
		props.callback(temp);
	};

	return (
		<>
			<Box
				borderWidth='1px'
				rounded='lg'
				borderColor={border[mode]}
				w='calc(100%)'
				py='5px'
			>
				<Text
					as='b'
					letterSpacing='4px'
					fontSize='xs'
					textTransform='uppercase'
					color={textColorLight[mode]}
					w='calc(100% - 30px)'
					px='15px'
				>
					Filter
				</Text>
				<Box h='8px'></Box>
				{props.filters.map((filter, index) => {
					return (
						<Box
							key={filter.label}
							w='calc(100%)'
							px='15px'
							py='10px'
							borderTop='1px'
							borderColor={border[mode]}
						>
							<Flex justify='space-between' mb={1}>
								<Text fontSize='xs' color={textColor[mode]}>
									{filter.label}
								</Text>
								{filter.type === "range" && (
									<Text
										as='b'
										fontSize='10px'
										bg={border[mode]}
										p={1}
										px={2}
										rounded='lg'
										color={textColorLight[mode]}
									>{`${filter.values[0]} - ${filter.values[1]} ${
										filter.unit ? filter.unit : ""
									}`}</Text>
								)}
								{filter.type === "slider" && (
									<Text
										as='b'
										fontSize='10px'
										bg={border[mode]}
										p={1}
										px={2}
										rounded='lg'
										color={textColorLight[mode]}
									>{`${
										filter.label === "Max. Risk Level"
											? filter.values / 100
											: filter.values
									} ${filter.unit ? filter.unit : ""}`}</Text>
								)}
							</Flex>
							{filter.type === "range" && (
								<RangeInput
									value={filter.values}
									min={filter.min}
									max={filter.max}
									step={1}
									callback={val => {
										changeValues(index, val);
									}}
									type='range'
									allowOverlap={true}
									colorMode={mode}
								></RangeInput>
							)}
							{filter.type === "slider" && (
								<RangeInput
									value={filter.values}
									min={filter.min}
									max={filter.max}
									steps={0.1}
									callback={val => {
										changeValues(index, val);
									}}
									type='slider'
									allowOverlap={true}
									colorMode={mode}
								></RangeInput>
							)}
						</Box>
					);
				})}
			</Box>
		</>
	);
};

export default Filter;
