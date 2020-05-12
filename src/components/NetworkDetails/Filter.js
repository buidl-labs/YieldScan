import React from "react";
import { Box, Text, Flex } from "@chakra-ui/core";
import { textColor, textColorLight, border } from "../../constants";
import { Slider } from "material-ui-slider";

const colorScheme = {
	primary: {
		bg: "#19CC95",
		color: "#FFF",
		hoverBg: "#14AC7D"
	},
	secondary: {
		bg: "#4A5567",
		color: "#FFF",
		hoverBg: "#2F3745"
	},
	white: {
		bg: "#FFF",
		color: "#19CC95",
		hoverBg: "#EEE"
	}
};

type FilterProps = {
	colorMode?: "light" | "dark"
};

const Filter = (props: FilterProps) => {
	const mode = props.colorMode ? props.colorMode : "light";
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
				<Box
					w='calc(100%)'
					px='15px'
					py='10px'
					borderTop='1px'
					borderColor={border[mode]}
				>
					<Flex justify='space-between'>
						<Text fontSize='sm' color={textColorLight[mode]}>
							No. of Nominators
						</Text>
						<Text fontSize='sm'>20k - 40k</Text>
					</Flex>
					{/* <Slider color='green' defaultValue={30}>
						<SliderTrack />
						<SliderFilledTrack />
						<SliderThumb />
					</Slider> */}
				</Box>
				<Box
					w='calc(100%)'
					px='15px'
					py='10px'
					borderTop='1px'
					borderColor={border[mode]}
				>
					<Flex justify='space-between'>
						<Text fontSize='sm' color={textColorLight[mode]}>
							No. of Nominators
						</Text>
						<Text fontSize='sm'>20k - 40k</Text>
					</Flex>
				</Box>
			</Box>
		</>
	);
};

export default Filter;
