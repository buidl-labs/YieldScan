import React from "react";
import { Box, Heading, Text, Tooltip, Icon } from "@chakra-ui/core";

const ExpectedReturns = () => {
	return (
		<>
			<Box w='100%' bg='#19CC95' py={8} px={10} rounded='lg' color='white'>
				<Heading as='h3' size='lg'>
					Expected Returns{" "}
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
				<Text fontSize='2xl' fontWeight='medium'>
					1.234 KSM
				</Text>
			</Box>
		</>
	);
};

export default ExpectedReturns;
