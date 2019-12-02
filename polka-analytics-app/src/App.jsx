import React from "react";
import { Link, NavLink, Route } from "react-router-dom";
import {
    Flex,
    IconButton,
    useColorMode,
    Box,
    Image,
    Heading,
    Text,
    Input,
    InputGroup,
    InputRightAddon
} from "@chakra-ui/core";
import ValidatorTable from "./components/ValidatorTable";
import HelpCenter from "./components/HelpCenter";

function App() {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Flex
            className="App"
            maxW="960px"
            justify="center"
            direction="column"
            m="auto"
            pb={8}
        >
            {/* Navbar */}
            <Flex direction="row" justifyContent="space-between" p={2}>
                {/* Polka Analytics Logo - Left hand part of navbar */}
                <Flex justify="flex-start" alignItems="center">
                    <NavLink to="/">
                        <Box
                            as="span"
                            display="inline-flex"
                            alignItems="center"
                        >
                            <Image src="/logo192.png" height="2rem" mr={4} />
                            <Heading as="h3" size="lg">
                                Polka Analytics
                            </Heading>
                        </Box>
                    </NavLink>
                </Flex>
                {/* Navigation Menu & color mode toggle - Right hand part of navbar */}
                <Flex justify="flex-end">
                    <Flex alignItems="center">
                        <Box mr={8}>
                            <NavLink to="/dashboard">Dashboard</NavLink>
                        </Box>
                        <Box mr={8}>
                            <NavLink to="/help-center">Help Center</NavLink>
                        </Box>
                    </Flex>
                    <IconButton
                        aria-label={
                            colorMode === "light"
                                ? "Switch to dark mode"
                                : "Switch to light mode"
                        }
                        icon={colorMode === "light" ? "moon" : "sun"}
                        size="lg"
                        onClick={toggleColorMode}
                        backgroundColor={
                            colorMode === "light" ? "#fff" : "gray.800"
                        }
                    />
                </Flex>
            </Flex>
            {/* Homepage - Dashboard */}
            <Route exact path="/(|dashboard)">
                <Heading as="h2" size="xl" textAlign="center" mt={16}>
                    Put your KSM tokens to work
                </Heading>
                <Text fontSize="2xl" textAlign="center">
                    You could be earning{" "}
                    <Box as="span" color="brand.900">
                        0.15301
                    </Box>{" "}
                    KSM daily
                </Text>
                {/* Stake Amount Input */}
                <Flex flexDirection="column" alignItems="center">
                    <InputGroup mt={8}>
                        <Input
                            placeholder="Stake Amount"
                            value="1000"
                            textAlign="center"
                            roundedLeft="2rem"
                            onChange={value => {
                                console.log(value);
                            }}
                        />
                        <InputRightAddon
                            children="KSM"
                            backgroundColor="teal.500"
                            roundedRight="2rem"
                        />
                    </InputGroup>
                </Flex>
                <Box as="span" color="teal.500" textAlign="center" mt={8}>
                    <Link to="/help-center/guides/how-to-stake">
                        How to stake?
                    </Link>
                </Box>
                {/* Validator Table */}
                <Text textAlign="center" mt={16} mb={8}>
                    Looking for a list of active validators to stake on? Look no
                    further!
                </Text>
                <ValidatorTable />
            </Route>
            {/* Help Center */}
            <Route path="/help-center">
                <HelpCenter />
            </Route>
        </Flex>
    );
}

export default App;
