import React from "react";
import { Route } from "react-router-dom";
import { Box, Button, Link, Heading, Text, Tooltip, Icon } from "@chakra-ui/core";
import CountUp from "react-countup";
import CustomButton from "../CustomButton"

type ExpectedReturnsProps = {
	returns: float,
	currency: string,
	button: bool,
};

const ExpectedReturns = (props: ExpectedReturnsProps) => {
	const returns = props.returns.toFixed(5);
	
	return (
		<>
			<Box w='100%' bg='#19CC95' py={8} px={10} rounded='lg' color='white'>
				<Heading as='h3' size='lg'>
					Expected Results{" "}
					<Tooltip
						label='Brief text about how we calculate returns'
						placement='bottom'
					>
						<Icon name='question' fontSize='md' opacity={0.7} />
					</Tooltip>
				</Heading>
				<Text fontSize='md' mt={4}>
					Expected Returns
				</Text>
				<Text mb={4} fontSize='2xl' fontWeight='medium'>
					<CountUp
						end={returns}
						decimals={3}
						suffix={props.currency}
					/>
				</Text>
				{props.button &&
				<Link
					href='/#/suggested-validators'
				>
					<CustomButton disabled={returns==0} variant="tertiary">
						Start Investing
					</CustomButton>
				</Link>
				}
			</Box>
		</>
	);
};

export default ExpectedReturns;
