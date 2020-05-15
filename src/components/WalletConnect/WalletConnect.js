import React from "react";
import {
	useHistory,
	Redirect,
	Route,
	Link as RouterLink
} from "react-router-dom";
import {
	Box,
	Heading,
	Flex,
	Link,
	Text,
	Image,
	Tooltip,
	Icon,
	Stack,
	Alert,
	AlertIcon,
	AlertDescription,
	CloseButton,
	PseudoBox
} from "@chakra-ui/core";
import Helmet from "react-helmet";

import Footer from "../Footer.jsx";
import { textColor, textColorLight, border } from "../../constants";
import Authorization from "../Authentication/Authorization";
import Auth from "../Auth";

type WalletConnectProps = {
	colorMode?: "light" | "dark"
};

const isChrome =
	!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
const isFirefox = typeof InstallTrigger !== "undefined";

const WalletConnect = (props: WalletConnectProps) => {
	const history = useHistory();
	const mode = props.colorMode ? props.colorMode : "light";
	const [isExtensionAvailable, setIsExtensionAvailable] = React.useState(true);
	const [accounts, setAccounts] = React.useState(null);

	return (
		<>
			<Helmet>
				<title>Yield Scan &middot; Wallet Connect</title>
			</Helmet>
			<Route exact path='/wallet-connect'>
				<Box m={4} mt={10}>
					<RouterLink
						onClick={() => {
							history.push("/suggested-validators");
						}}
					>
						<Icon name='arrow-back' mr={1} /> Back
					</RouterLink>
				</Box>
				<Box w='100%' my={10}>
					<Flex w='100%' justify='center'>
						<Image
							htmlWidth='100px'
							src='./MoneybagGraphic.svg'
							alt='Wallet Connect Illustration'
						/>
					</Flex>
				</Box>
				<Box w='100%'>
					<Heading
						as='h6'
						size='lg'
						textAlign='center'
						color={textColorLight[mode]}
					>
						Just one more step...
					</Heading>
					<Heading as='h3' size='xl' textAlign='center' color={textColor[mode]}>
						Connect to the PolkadotJS Wallet
					</Heading>
					<Text
						size='sm'
						color={textColorLight[mode]}
						textAlign='center'
						w='100%'
						height='auto'
					>
						To start investing you need to connect to the PolkadotJS Wallet{" "}
						<Tooltip
							label='PolkadotJS Wallet allows you to manage your polkadot accounts outside of dapps. It injects the accounts and allows signing transactions for a specific account.'
							placement='bottom'
							hasArrow
						>
							<Link href='' isExternal>
								<Icon
									name='question'
									color={textColorLight[mode]}
									opacity={0.5}
								/>
							</Link>
						</Tooltip>
					</Text>
					<Stack m={4} mt={12} spacing={4} align='center'>
						{!isExtensionAvailable && (
							<Alert status='error'>
								<AlertIcon />
								<AlertDescription mr={2}>
									Extension not found. Please ensure that you have PolkadotJS
									Browser Extension installed.
								</AlertDescription>
								<CloseButton position='absolute' right='8px' top='8px' />
							</Alert>
						)}
						<Link
							minWidth='30%'
							onClick={async () => {
								const authInfo = await Authorization();
								setIsExtensionAvailable(authInfo.isExtensionAvailable);
								setAccounts(authInfo.accounts);
								Auth.login(() =>
									authInfo.isExtensionAvailable && authInfo.accounts ? (
										history.push("/confirmation")
									) : (
										console.error("error")
									)
								);
							}}
						>
							<PseudoBox
								px={10}
								py={5}
								shadow='md'
								borderWidth='1px'
								borderColor={border[mode]}
								rounded='md'
								minWidth='30%'
								cursor='pointer'
								transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
								_hover={{
									borderColor: "#19CC95",
									boxShadow: "0 0 0 0.25rem #19CC9555"
								}}
							>
								<Heading size='sm' fontWeight='normal' textAlign='center'>
									I already have the extension
								</Heading>
							</PseudoBox>
						</Link>

						{isChrome && (
							<Link
								href='https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd'
								minWidth='30%'
								target='_blank'
							>
								<PseudoBox
									px={10}
									py={5}
									shadow='md'
									borderWidth='1px'
									borderColor={border[mode]}
									rounded='md'
									minWidth='30%'
									cursor='pointer'
									transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
									_hover={{
										borderColor: "#19CC95",
										boxShadow: "0 0 0 0.25rem #19CC9555"
									}}
								>
									<Heading size='sm' fontWeight='normal' textAlign='center'>
										What extension?
									</Heading>
								</PseudoBox>
							</Link>
						)}
						{isFirefox && (
							<Link
								href='https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/'
								minWidth='30%'
								target='_blank'
							>
								<PseudoBox
									px={10}
									py={5}
									shadow='md'
									borderWidth='1px'
									borderColor={border[mode]}
									rounded='md'
									minWidth='30%'
									cursor='pointer'
									transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
									_hover={{
										borderColor: "#19CC95",
										boxShadow: "0 0 0 0.25rem #19CC9555"
									}}
								>
									<Heading size='sm' fontWeight='normal' textAlign='center'>
										What extension?
									</Heading>
								</PseudoBox>
							</Link>
						)}
						{!isFirefox && !isChrome && (
							<Link minWidth='30%'>
								<PseudoBox
									px={10}
									py={5}
									shadow='md'
									borderWidth='1px'
									borderColor={border[mode]}
									rounded='md'
									minWidth='30%'
									cursor='pointer'
									transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
									_hover={{
										borderColor: "#19CC95",
										boxShadow: "0 0 0 0.25rem #19CC9555"
									}}
								>
									<Heading size='sm' fontWeight='normal' textAlign='center'>
										Browser Does not suppport extesion.
									</Heading>
								</PseudoBox>
							</Link>
						)}
					</Stack>
				</Box>
			</Route>
			<Footer />
		</>
	);
};

export default WalletConnect;
