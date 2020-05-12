import React from "react";
import { Route } from "react-router-dom";
import {
	Box,
	Heading,
	Flex,
	Text,
	Link,
	Icon,
	Select,
	Badge,
	Checkbox,
	Tooltip
} from "@chakra-ui/core";
import Helmet from "react-helmet";
import {
    web3Enable,
    isWeb3Injected,
    web3AccountsSubscribe,
 	web3FromAddress 
} from '@polkadot/extension-dapp';
import { WsProvider, ApiPromise } from '@polkadot/api';
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

async function __useEffect (state, setState, freeBalance, setFreeBalance, amount, stashId, controllerId, selectedValidators) {

	switch (state) {
		case 'init':
			setState ('step-two');

		case 'step-two':
			let provider;
			let api;
			let balance;
			if (stashId) {
				provider = new WsProvider('wss://kusama-rpc.polkadot.io/');
				api = await ApiPromise.create({ provider });
				try {
					balance = await api.query.system.balances.freeBalance(stashId);
					console.log ('[free-balance] balance', balance);
					const transferrable =
						balance.toString() / 10 ** 12;

					const freeBalance = parseFloat(transferrable.toFixed(3));

					setFreeBalance (freeBalance);

					console.log ('[free-balance] free balance', freeBalance);

					if (freeBalance > amount) {
						setState ('sufficient-funds');

					}
					else {
						setState ('insufficient-funds');
						console.log ('insufficient funds');
					}
				}
				catch {
					console.log('error in connection');
				}
			}
			break;

		case 'stake':
			const bonded = amount * 10 ** 12
			if (controllerId && stashId) {
				const ledger = await api.query.staking.ledger(stashId)

				if (!ledger) {
					console.log('api.tx.staking.bond')
					api.tx.staking
						.bond(controllerId, bonded, 0)
						.signAndSend(stashId, status => {
							console.log(
								'status',
								JSON.parse(JSON.stringify(status))
							)
							setState ('step-three');
						})
						.catch(error => {
							console.log('Error', error)
						})
				} else {
					console.log('api.tx.staking.bondExtra')
					api.tx.staking
						.bondExtra(bonded)
						.signAndSend(stashId, status => {
							console.log(
								'status',
								JSON.parse(JSON.stringify(status))
							)
							setState ('step-three');
						})
						.catch(error => {
							console.log('Error', error.toString())
						})
				}
			}
			break;

		case 'step-three':
			if (stashId) {
				const injector = await web3FromAddress(stashId)
				api.setSigner(injector.signer)
				api.tx.staking
					.nominate(
						selectedValidators.map(
							validator => validator.stashId
						)
					)
					.signAndSend(stashId, status => {
						console.log(
							'status',
							JSON.parse(JSON.stringify(status))
						)
						setState ('step-four');
					})
					.catch(error => {
						console.log('Error', error)
					})
			}
			break

		case 'step-four':
			setState('********staked********');
			break;

		default:
			setState('default');
			break;
	}
}

const ConfirmationPage = (props: ConfirmationPageProps) => {
	const mode = props.colorMode ? props.colorMode : "light";
	const [state, setState] = React.useState ('init');
	const [termsCheck, setTermsCheck] = React.useState(false);
	const [freeBalance, setFreeBalance] = React.useState();
	const [stashId, setStashId] = React.useState();
	const [controllerId, setControllerId] = React.useState();

	React.useEffect (() => {
		__useEffect (state, setState, freeBalance, setFreeBalance, props.amount, stashId, controllerId, props.validatorsList);
	}, [state, props, stashId, controllerId])

	React.useEffect (()=>{
		setStashId (stashId);
		setControllerId (controllerId);
	}, [stashId, controllerId])

	console.log(state);

	const handleSubmit = () => {
		if (state == 'sufficient-funds') setState ('stake');
	}

	return (
		<>
			<Helmet>
				<title>Yield Scan &middot; Confirmation</title>
			</Helmet>
			<Route exact path='/confirmation'>
				<Box m={4} mt={10}>
					<Link m={4}>
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
								onChange={(e)=>{
								setStashId (e.target.value);
								}}
							>
								{ props.users && Object.keys(props.users).map((keyName, i) => {
									return (
										<option
											style={{ color: "#000", background: "#FFF" }}
											value={props.users[keyName].address}
											key={i}
										>
											{props.users[keyName].meta.name} {props.users[keyName].address}
										</option>
									);
								})}
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
								onChange={(e)=>{
									setControllerId (e.target.value);
								}}
							>
								{ props.users && Object.keys(props.users).map((keyName, i) => {
									return (
										<option
											value={props.users[keyName].address}
											key={i}
											style={{ color: "#000", background: "#FFF" }}
										>
											{props.users[keyName].meta.name} {props.users[keyName].address}
										</option>
									);
								})}
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
						<Box w='100%' p={2} mt={6} h='50vh' overflow='auto'>
							{props.validatorsList && props.validatorsList.map((validator, index) => {
								return (
									<ValidatorTile
										key={index}
										name={validator.name}
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
							<CustomButton disable={!termsCheck} onClick={handleSubmit}>Submit</CustomButton>
							{!termsCheck && (
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
