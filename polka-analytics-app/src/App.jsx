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
import { ApiPromise, WsProvider } from "@polkadot/api";
import { hexToString } from "@polkadot/util";
import ValidatorTable from "./components/ValidatorTable";
import HelpCenter from "./components/HelpCenter";

function App() {
    const { colorMode, toggleColorMode } = useColorMode();
    const [validatorData, setValidatorData] = React.useState([]);
    const [validatorTableData, setValidatorTableData] = React.useState([]);
    const [maxDailyEarning, setMaxDailyEarning] = React.useState(0);
    const [stakeAmount, setStakeAmount] = React.useState(1000.0);

    const createApi = async () => {
        console.log(`Connecting to API...`);
        const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io");
        const api = await ApiPromise.create({ provider: wsProvider });
        await api.isReady;
        console.log(`API is ready`);

        // Fetch recent reward events from Polkascan
        const res = await fetch(
            "https://polkascan.io/kusama-cc3/api/v1/event?&filter[module_id]=staking&filter[event_id]=Reward&page[size]=25"
        );
        const json = await res.json();
        const rewardData = await json.data;

        // Retrieve the last known era reward
        const reward = await rewardData[0].attributes.attributes[0].value;
        // Retrieve the hashes of the end of era blocks
        const hash = await Promise.all(
            rewardData.map(data =>
                api.rpc.chain.getBlockHash(data.attributes.block_id - 1)
            )
        );
        // Retrieve the era points for all end of era blocks
        const eraPoints = await Promise.all(
            hash.map(data =>
                api.query.staking.currentEraPointsEarned.at(
                    `${data.toString()}`
                )
            )
        );
        // Retrieve an array of the list of all elected validators at the end of era blocks
        const validatorList = await Promise.all(
            hash.map(data =>
                api.query.staking.currentElected.at(`${data.toString()}`)
            )
        );

        let result = {};

        await Promise.all(
            validatorList.map(async validator => {
                await Promise.all(
                    validator.map(async address => {
                        const commission = await api.query.staking.validators(
                            address
                        );
                        const name = await api.query.nicks.nameOf(
                            `${address.toString()}`
                        );
                        result[address] = {
                            stashId: address.toString(),
                            stashIdTruncated: `${address
                                .toString()
                                .slice(0, 4)}...${address
                                .toString()
                                .slice(-6, -1)}`,
                            points: [],
                            poolReward: "",
                            totalStake: "",
                            commission:
                                commission[0].commission.toNumber() / 10 ** 7,
                            name: name.raw[0]
                                ? hexToString(name.raw[0].toString())
                                : `Validator (...${address
                                      .toString()
                                      .slice(-6, -1)})`
                        };
                    })
                );
            })
        );

        eraPoints.map((eraPoint, index) => {
            eraPoint.individual.map((point, validatorIndex) => {
                result[validatorList[index][validatorIndex]].points.push(
                    point.toNumber() / eraPoint.total.toNumber()
                );
                return 0;
            });
            return 0;
        });

        const validatorData = await Promise.all(
            Object.keys(result).map(async (key, index) => {
                const validatorPoolReward =
                    ((result[key].points.reduce((acc, curr) => acc + curr, 0) /
                        result[key].points.length) *
                        reward) /
                    10 ** 12;
                const stakeInfo = await api.derive.staking.info(key);
                const totalStake =
                    stakeInfo.stakers.total.toString() / 10 ** 12;
                result[key].totalStake = totalStake;
                result[key].poolReward = isNaN(validatorPoolReward)
                    ? "Not enough data"
                    : (1 - result[key].commission / 100) * validatorPoolReward;
                return result[key];
            })
        );
        setValidatorData(validatorData);
        return validatorData;
    };

    const calcReward = React.useCallback(() => {
        const data = validatorData.map(validator => {
            const {
                stashId,
                stashIdTruncated,
                name,
                commission,
                totalStake,
                poolReward
            } = validator;
            const userStakeFraction = stakeAmount / (stakeAmount + totalStake);
            const dailyEarning = userStakeFraction * poolReward;
            if (dailyEarning > maxDailyEarning) setMaxDailyEarning(dailyEarning)
            return {
                stashId: stashId,
                stashIdTruncated: stashIdTruncated,
                name: name,
                commission: commission,
                dailyEarning: `${dailyEarning} KSM`
            };
        });

        setValidatorTableData(data);
    }, [stakeAmount, validatorData, maxDailyEarning]);

    React.useEffect(() => {
        createApi();
        calcReward();
    }, [calcReward]);

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
                        {maxDailyEarning}
                    </Box>{" "}
                    KSM daily
                </Text>
                {/* Stake Amount Input */}
                <Flex
                    flexDirection="column"
                    alignItems="center"
                    position="sticky"
                    top="0"
                    backgroundImage={
                        colorMode === "light"
                            ? "linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 1), rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))"
                            : "linear-gradient(rgba(26, 32, 44, 1), rgba(26, 32, 44, 1), rgba(26, 32, 44, 1), rgba(26, 32, 44, 0))"
                    }
                >
                    <InputGroup my={8}>
                        <Input
                            placeholder="Stake Amount"
                            variant="filled"
                            value={stakeAmount}
                            textAlign="center"
                            roundedLeft="2rem"
                            onChange={e =>
                                setStakeAmount(
                                    isNaN(parseFloat(e.target.value))
                                        ? 0
                                        : parseFloat(e.target.value) 
                                )
                            }
                        />
                        <InputRightAddon
                            children="KSM"
                            backgroundColor="teal.500"
                            roundedRight="2rem"
                        />
                    </InputGroup>
                </Flex>
                <Box as="span" color="teal.500" textAlign="center">
                    <Link to="/help-center/guides/how-to-stake">
                        How to stake?
                    </Link>
                </Box>
                {/* Validator Table */}
                <Text textAlign="center" mt={16} mb={8}>
                    Looking for a list of active validators to stake on? Look no
                    further!
                </Text>
                <ValidatorTable
                    dataSource={
                        validatorTableData !== undefined
                            ? validatorTableData
                            : []
                    }
                />
            </Route>
            {/* Help Center */}
            <Route path="/help-center">
                <HelpCenter />
            </Route>
        </Flex>
    );
}

export default App;
