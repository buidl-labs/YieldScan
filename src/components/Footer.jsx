import React from 'react'
import { Box, Link, Icon } from '@chakra-ui/core'
import { FaHeart } from 'react-icons/fa'

export default () => {
    return (
			<Box width='100%' textAlign='center' color="gray.500" fontSize="xs" mt={24} mb={4}>
				Made with{" "}
				<Box as={FaHeart} display='inline-block' size='16px' color='red.500' />{" "}
				by people @{" "}
				<Link
					href='http://www.buidllabs.io/'
					color='teal.500'
					isExternal
				>
					BUIDL Labs
				</Link>
				, a portfolio company of{" "}
				<Link
					href='https://www.thevantageproject.com/'
					color='teal.500'
					isExternal
				>
					The Vantage Project
				</Link>
			</Box>
		);
}
