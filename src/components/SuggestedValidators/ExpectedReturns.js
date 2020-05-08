import React from "react";
import { useHistory, Route, Link, Redirect } from "react-router-dom";
import { Box, Button, Heading, Text, Tooltip, Icon } from "@chakra-ui/core";
import CountUp from "react-countup";
import CustomButton from "../CustomButton";

type ExpectedReturnsProps = {
	budget: float,
	returns: float,
	currency: string,
	button: boolean,
};

const ExpectedReturns = (props: ExpectedReturnsProps) => {
	const history = useHistory();

	const returns = props.returns.toFixed(5);

	function handleInvestClick() {
		props.buttonClick();
		history.push('/suggested-validators');
	}
	
	return (
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
						suffix={` ${props.currency}`}
					/>
				</Text>
				{props.button &&
				<CustomButton 
					disable={!props.budget || props.budget==0} 
					variant="white"
					onClick={handleInvestClick}
				>
						Start Investing
				</CustomButton>
				}
			</Box>
	);
};

export default ExpectedReturns;
