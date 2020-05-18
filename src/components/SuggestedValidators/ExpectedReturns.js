import React from "react";
import { useHistory } from "react-router-dom";
import { Box, Heading, Text, Tooltip, Icon } from "@chakra-ui/core";
import CountUp from "react-countup";
import CustomButton from "../CustomButton";
import Auth from "../Auth";

type ExpectedReturnsProps = {
	budget: float,
	returns: float,
	currency: string,
	button: boolean
};

const ExpectedReturns = (props: ExpectedReturnsProps) => {
	const history = useHistory();

	const {returns} = props;

	return (
		<Box w='100%' bg='#19CC95' py={8} px={10} rounded='lg' color='white'>
			<Heading as='h3' size='lg'>
				Expected Results{" "}
				<Tooltip
					label='These returns are calculated based on the past performance of validators'
					placement='bottom'
				>
					<Icon name='question' fontSize='md' opacity={0.7} />
				</Tooltip>
			</Heading>
			<Text fontSize='md' mt={4}>
				Expected Daily Returns
			</Text>
			<Text mb={4} fontSize='2xl' fontWeight='medium'>
				<CountUp end={returns} decimals={3} suffix={` ${props.currency}`} />
			</Text>
			{props.button && (
				<CustomButton
					disable={!props.budget || props.budget === 0 || !props.isResultReady || !props.suggestionsFound}
					variant='white'
					onClick={() => {
						Auth.login(() => {
							history.push("/suggested-validators");
						});
					}}
				>
					Start Investing
				</CustomButton>
			)}
		</Box>
	);
};

export default ExpectedReturns;
