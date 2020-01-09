import React from "react";
import { Route, Link } from "react-router-dom";
import {
    Box,
    Heading,
    Text,
    // Flex,
    // InputGroup,
    // Input,
    // InputRightAddon,
    // Icon,
    // Button,
    Link as ChakraLink
} from "@chakra-ui/core";
import FAQs from "./FAQs";
import HowToStake from "./guides/HowToStake";
import LogEvent from './LogEvent';

export default function HelpCenter() {
    return (
        <React.Fragment>
            {/* Help Center Home */}
            <LogEvent eventType="Help center view" />
            <Route exact path="/help-center">
                <Heading as="h2" size="xl" textAlign="center" mt={16}>
                    Help Center
                </Heading>
                {/* <Text fontSize="2xl" textAlign="center">
                    What are you looking for?
                </Text> */}
                {/* Search Input */}
                {/* <Flex flexDirection="column" alignItems="center">
                    <InputGroup mt={8}>
                        <Input
                            placeholder="Search the documentation"
                            variant="filled"
                            roundedLeft="2rem"
                        />
                        <InputRightAddon
                            as={Button}
                            children={<Icon name="search" />}
                            backgroundColor="teal.500"
                            roundedRight="2rem"
                            px={8}
                        />
                    </InputGroup>
                </Flex> */}

                {/* Guides Section */}
                <Text fontSize="2xl" textAlign="center" mt={16}>
                    Guides
                </Text>
                {/* List of guides */}
                <Link to="/help-center/guides/how-to-stake">
                    <Box className="card" mt={8} p={8}>
                        <Heading as="h3" size="lg">
                            How to stake
                        </Heading>
                        <Text my={4}>
                            A step by step guide explaining how to stake tokens
                            on the Polkadot Network.
                        </Text>
                    </Box>
                </Link>

                {/* FAQs Section */}
                <Text fontSize="2xl" textAlign="center" mt={16} mb={8}>
                    FAQs
                </Text>
                <FAQs />

                {/* Contact Us */}
                <Box my={16} textAlign="center">
                    <Text fontSize="xl">
                        Can't find what you're looking for?
                    </Text>
                    <ChakraLink
                        href="mailto:sahil@thevantageproject.com"
                        color="teal.500"
                    >
                        Contact Us
                    </ChakraLink>
                </Box>
            </Route>

            {/* Guides */}
            <Route exact path="/help-center/guides/how-to-stake">
                <HowToStake />
            </Route>
        </React.Fragment>
    );
}
