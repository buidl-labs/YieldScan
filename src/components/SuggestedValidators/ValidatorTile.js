import React from "react";
import Identicon from '@polkadot/react-identicon'
import { Avatar, Box, Text, Heading, Flex, Badge } from "@chakra-ui/core";
import {
	getRiskLevelColor as getBadgeColor,
	textColor,
	textColorLight,
	border as borderColor
} from "../../constants";

type ValidatorTileProps = {
	colorMode: string,
	name: string,
	amount: float,
	risk: float,
	currency: string,
	stashId: string
};

const ValidatorTile = (props: ValidatorTileProps) => {
	const riskBadge = getBadgeColor(props.risk);

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
					{/*	
					<Avatar
						size='md'
						src={props.avatar ? props.avatar : "default_path"}
						mr={4}
					/> */}
					<Flex alignItems="center" mr={4}>
						<Identicon
							value={props.stashId}
							size={36}
							theme="polkadot"
						/>
					</Flex>
					<Box>
						<Heading as='h6' size='sm'>
							{props.name}
						</Heading>
						<Text color={textColor[props.colorMode]} fontSize='sm'>
							Staking Amount: {props.amount} {props.currency}
							{props.risk && (
								<>
									<Text as='i' color={textColorLight[props.colorMode]} mx={1}>
										|
									</Text>
									Risk Score:
									<Badge as="span" mx={2} fontSize='sm' variantColor={riskBadge}>
										{props.risk}
									</Badge>
								</>
							)}
						</Text>
					</Box>
				</Flex>
			</Box>
		</>
	);
};

export default ValidatorTile;
