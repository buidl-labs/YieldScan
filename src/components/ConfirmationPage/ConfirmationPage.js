import React from "react";
import { useHistory, Link, Route } from "react-router-dom";
import {
	Box,
	Heading,
	Flex,
	Text,
	Icon,
	Select,
	Badge,
	Checkbox,
	Alert,
	AlertIcon,
	AlertDescription
} from "@chakra-ui/core";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import Helmet from "react-helmet";
import Footer from "../Footer.jsx";
import ValidatorTile from "../SuggestedValidators/ValidatorTile";
import {
	textColor,
	textColorLight,
	border,
	getRiskLevelColor,
	getRiskLevel
} from "../../constants";
import CustomButton from "../CustomButton";
import useVerifyBalance from "./useVerifyBalance";
import Authorization from "../Authentication/Authorization";
import SubmitStakingTransaction from "./SubmitStakingTransaction";

type ConfirmationPageProps = {
	colorMode?: "light" | "dark",
	stashOptions: Array<{ option: string, value: string }>,
	controllerOptions: Array<{ option: string, value: string }>,
	riskPreference: string,
	validatorsList: Array<{
		name: string,
		avatar?: string,
		amount: float,
		risk?: float
	}>,
	fees: string,
	eras: Number,
	amount: float,
	currency: string,
	users: Array<{}>
};

const messageBoxColors = {
	light: {
		bg: "#E0F4FF",
		border: "#C1E9FF",
		text: "#89BEDC"
	},
	dark: {
		bg: "#354056",
		border: "#678AD1",
		text: "#CCDDFF"
	}
};

const ConfirmationPage = (props: ConfirmationPageProps) => {
	const history = useHistory();
	const mode = props.colorMode ? props.colorMode : "light";

	const [stashId, setStashId] = React.useState();
	const [controllerId, setControllerId] = React.useState();
	const [accounts, setAccounts] = React.useState(null);
	const [termsCheck, setTermsCheck] = React.useState(false);
	const isEnoughBalance = useVerifyBalance({
		stashId,
		controllerId,
		stakeAmount: props.amount,
		validatorList: props.validatorsList.map(validator => validator.stashId)
	});

	const getAuthInfo = async () => {
		const authInfo = await Authorization();
		setAccounts(authInfo.accounts);
	};
	const handleSubmit = () => {
		SubmitStakingTransaction({
			stashId,
			controllerId,
			stakeAmount: props.amount,
			validatorList: props.validatorsList.map(validator => validator.stashId)
		});
	};

	const testSubmitTransaction = async () => {
		const testing = await SubmitStakingTransaction({
			stashId,
			controllerId,
			stakeAmount: props.amount,
			validatorList: props.validatorsList.map(validator => validator.stashId)
		});

		console.log(testing);
	};

	React.useEffect(() => {
		getAuthInfo();
	}, []);

	return (
		<>
			<Helmet>
				<title>Yield Scan &middot; Confirmation</title>
			</Helmet>
			<Route exact path='/confirmation'>
				<Box m={4} mt={10}>
					<Link
						m={4}
						onClick={() => {
							history.push("/suggested-validators");
						}}
					>
						<Icon name='arrow-back' mr={1} /> Back
					</Link>
				</Box>
				<Flex w='100%' justify='center'>
					<Box w={["100%", "80%", "60%", "50%"]}>
						<Heading
							as='h3'
							size='xl'
							textAlign='center'
							color={textColor[mode]}
						>
							Confirmation
						</Heading>
						<Text
							size='sm'
							color={textColorLight[mode]}
							textAlign='center'
							w='100%'
							height='auto'
							mb={8}
						>
							You are about to stake your {props.currency} on the following
							validators. Please make sure you understand the risks before
							proceeding.
						</Text>
						<Flex align='center' wrap='wrap' my={2}>
							<Text
								color={textColorLight[mode]}
								my={2}
								w={["100%", "150px", "200px", "200px"]}
							>
								Stash Account
							</Text>
							<Select
								placeholder='Select Account'
								w={[
									"calc(100%)",
									"calc(100% - 150px)",
									"calc(100% - 200px)",
									"calc(100% - 200px)"
								]}
								name='stashID'
								onChange={e => {
									setStashId(e.target.value);
								}}
							>
								{(() =>
									accounts &&
									accounts.map((account, i) => {
										const decoded = decodeAddress(account.address);
										const encodedAddress = encodeAddress(decoded, 2);
										return (
											<option
												style={{ color: "#000", background: "#FFF" }}
												value={account.address}
												key={i}
											>
												{account.meta.name} {encodedAddress}
											</option>
										);
									}))()}
							</Select>
						</Flex>
						<Flex align='center' wrap='wrap' my={2}>
							<Text
								color={textColorLight[mode]}
								my={2}
								w={["100%", "150px", "200px", "200px"]}
							>
								Controller Account
							</Text>
							<Select
								placeholder='Select Account'
								w={[
									"calc(100%)",
									"calc(100% - 150px)",
									"calc(100% - 200px)",
									"calc(100% - 200px)"
								]}
								name='controllerID'
								onChange={e => {
									setControllerId(e.target.value);
								}}
							>
								{(() =>
									accounts &&
									accounts.map((account, i) => {
										const decoded = decodeAddress(account.address);
										const encodedAddress = encodeAddress(decoded, 2);
										return (
											<option
												style={{ color: "#000", background: "#FFF" }}
												value={account.address}
												key={i}
											>
												{account.meta.name} {encodedAddress}
											</option>
										);
									}))()}
							</Select>
						</Flex>
						<Flex align='center' wrap='wrap' my={2}>
							<Text
								color={textColorLight[mode]}
								my={2}
								w={["100%", "150px", "200px", "200px"]}
							>
								Risk Preference
							</Text>
							<Badge
								mx={1}
								px={3}
								py={1}
								fontSize='sm'
								variantColor={getRiskLevelColor(props.riskPreference)}
							>
								{getRiskLevel(props.riskPreference)}
							</Badge>
						</Flex>
						{stashId === controllerId ? (
							<Alert status='warning' mt={4}>
								<AlertIcon />
								<AlertDescription mr={2}>
									Distinct stash and controller accounts are recommended to
									ensure fund security. You will be allowed to make the
									transaction, but take care to not tie up all funds, only use a
									portion of the available funds during this period.
								</AlertDescription>
							</Alert>
						) : (
							""
						)}
						<Box w='100%' p={2} mt={6} maxHeight='50vh' overflow='auto'>
							{props.validatorsList &&
								props.validatorsList.map((validator, index) => {
									return (
										<ValidatorTile
											key={index}
											name={validator.Validator}
											stashId={validator.stashId}
											amount={validator.amount}
											currency={props.currency}
											avatar={validator.avatar}
											colorMode={props.colorMode}
										/>
									);
								})}
						</Box>
						<Text
							textAlign='center'
							color={textColorLight[mode]}
							my={4}
							fontSize='xs'
						>
							* the estimated daily earnings are indicative. Actual rewards may
							vary.
						</Text>
						<Box
							p={4}
							my={4}
							w='100%'
							bg={messageBoxColors[mode].bg}
							borderColor={messageBoxColors[mode].border}
							borderWidth='1px'
							rounded='md'
						>
							<Text
								fontSize='xs'
								color={messageBoxColors[mode].text}
								textAlign='center'
							>
								Fees of {props.fees} {props.currency} will be applied to the
								submission and funds will be locked for {props.eras} eras
							</Text>
						</Box>
						<Flex align='flex-start'>
							<Checkbox
								mx={4}
								my={1}
								variantColor='blue'
								size='lg'
								isChecked={termsCheck}
								onChange={e => {
									setTermsCheck(!termsCheck);
								}}
							></Checkbox>
							<Text
								fontSize={["xs", "xs", "sm", "sm"]}
								color={textColorLight[mode]}
							>
								I understand that the funds will be bonded, meaning the tokens
								would be locked for a period of time and can only be redeemed
								after that period ends, and could be slashed if the validators I
								nominate misbehave.
							</Text>
						</Flex>
						<Flex
							w='100%'
							px={2}
							py={0}
							my={4}
							bg={border[mode]}
							borderWidth='2px'
							rounded='lg'
							align='center'
							justify='center'
							wrap='wrap'
						>
							<Box
								w={[
									"calc(50% - 1rem)",
									"calc(50% - 1rem)",
									"calc(50% - 1rem)",
									"calc(50% - 1rem)"
								]}
								p={4}
							>
								<Text color={textColor[mode]} w='100%'>
									<b>Amount</b>
								</Text>
								<Text color={textColorLight[mode]} fontSize='2xl' w='100%'>
									{props.amount}
								</Text>
							</Box>
							<Box
								w={[
									"calc(50% - 1rem)",
									"calc(50% - 1rem)",
									"calc(50% - 1rem)",
									"calc(50% - 1rem)"
								]}
								p={4}
							>
								<Text color={textColor[mode]} w='100%'>
									<b>Currency</b>
								</Text>
								<Text color={textColorLight[mode]} fontSize='xl' w='100%'>
									{props.currency}
								</Text>
							</Box>
						</Flex>
						<Flex justify='center' py={2} wrap='wrap'>
							<CustomButton
								disable={!termsCheck || !stashId || !controllerId}
								onClick={handleSubmit}
							>
								Submit
							</CustomButton>
							{!termsCheck ? (
								<Text
									textAlign='center'
									w='100%'
									m={2}
									fontSize='xs'
									as='i'
									color={textColorLight[mode]}
								>
									Please agree to the terms before submitting
								</Text>
							) : (
								!isEnoughBalance && (
									<Text
										textAlign='center'
										w='100%'
										m={2}
										fontSize='xs'
										as='i'
										color={textColorLight[mode]}
									>
										Please select accounts with enough balance to pay the stake
										amount and transaction fee
									</Text>
								)
							)}
						</Flex>
					</Box>
				</Flex>
			</Route>
			<Footer />
		</>
	);
};

export default ConfirmationPage;
