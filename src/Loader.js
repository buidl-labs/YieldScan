import React from 'react'
import { Box, CircularProgress, Text } from '@chakra-ui/core';

export default () => (
	<Box
		display='flex'
		flexDirection='column'
		position='absolute'
		top='50%'
		transform='translateY(-50%)'
		alignSelf='center'
		justifyContent='center'
		textAlign='center'
		mt={-16}
	>
		<CircularProgress
			isIndeterminate
			as='span'
			color='brand'
			size='36px'
			alignSelf='center'
		/>
		<Text mt={4} fontSize='xl' color='gray.500' maxW={300}>
			Rome wasn't built in a day...
			<br />
			But this page will load in a few minutes :)
		</Text>
	</Box>
);