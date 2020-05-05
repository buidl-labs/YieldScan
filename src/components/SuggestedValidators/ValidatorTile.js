import React from "react";
import { Avatar, Box, Text, Icon, Heading, Flex, Badge } from "@chakra-ui/core";

const borderColor = { light: "gray.100", dark: "#262E3F" };
const textColor = { light: "gray.600", dark: "#7385A7" };
const textColorLight = { light: "gray.300", dark: "#4B5871" };

type ValidatorTileProps = {
	colorMode: string,
	name: string,
	avatar?: string,
	amount: float,
	risk: float,
	currency: string
};

const ValidatorTile = (props: ValidatorTileProps) => {
	return (
		<>
			<Box
				w='100%'
				py={3}
				px={5}
				my={1}
				border='1px'
				borderRadius='md'
				borderColor={borderColor[props.colorMode]}
			>
				<Flex alignItems='center'>
					{/* <Icon name='check' fontSize='xl' color='#19CC95' /> */}
					<Avatar
						size='md'
						src={props.avatar ? props.avatar : "default_path"}
						mr={4}
					/>
					<Box>
						<Heading as='h6' size='sm'>
							{props.name}
						</Heading>
						<Text color={textColor[props.colorMode]} fontSize='sm'>
							Staking Amount: {props.amount} {props.currency}
							<Text as='i' color={textColorLight[props.colorMode]} mx={1}>
								|
							</Text>
							Risk Score:
							<Badge
								mx={2}
								fontSize='sm'
								variantColor={
									props.risk > 0.25
										? props.risk > 0.5
											? "red"
											: "yellow"
										: "green"
								}
							>
								{props.risk}
							</Badge>
						</Text>
					</Box>
				</Flex>
			</Box>
		</>
	);
};

export default ValidatorTile;
