import React from 'react'
import { Box, Link, Icon } from '@chakra-ui/core'
import { FaHeart } from 'react-icons/fa'

export default () => {
    return (
        <Box width="100%" textAlign="center" my={4}>
            Made with{' '}
            <Box
                as={FaHeart}
                display="inline-block"
                size="24px"
                color="red.500"
            />{' '}
            by people @ BUIDL Labs, a portfolio company of{' '}
            <Link
                href="https://www.thevantageproject.com/"
                color="teal.500"
                isExternal
            >
                The Vantage Project
            </Link>
        </Box>
    )
}
