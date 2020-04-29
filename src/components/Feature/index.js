import React from 'react'
import { Box, Heading, Text } from '@chakra-ui/core'

function Feature({ title, desc, ...rest }) {
    return (
        <Box
            style={{ marginTop: '5px', marginBottom: '5px' }}
            p={5}
            shadow="md"
            borderWidth="1px"
            flex="1"
            rounded="md"
            {...rest}
        >
            <Heading fontSize="xl">{title}</Heading>
            <Text mt={4}>{desc}</Text>
        </Box>
    )
}

export default Feature
