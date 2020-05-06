import React from "react";
import { Route } from "react-router-dom";
import {
	Box,
	Heading,
	Flex,
	Text,
	Image,
	Tooltip,
	Link,
	Icon,
	Stack,
	PseudoBox
} from "@chakra-ui/core";
import Helmet from "react-helmet";
import Footer from "../Footer.jsx";
import { textColor, textColorLight, border } from "../../constants";

type WalletConnectProps = {
	colorMode?: "light" | "dark"
};

const WalletConnect = (props: WalletConnectProps) => {
	const mode = props.colorMode ? props.colorMode : "light";
	return (
		<React.Fragment>
			<Helmet>
				<title>Suggested Validators</title>
			</Helmet>
			<Route exact path='/wallet-connect'>
				<Box m={4} mt={10}>
					<Link m={4}>
						<Icon name='arrow-back' mr={1} /> Back
					</Link>
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
						Connect to the PolkaJS Wallet
					</Heading>
					<Text
						size='sm'
						color={textColorLight[mode]}
						textAlign='center'
						w='100%'
						height='auto'
					>
						To start investing you need to connect to the PolkaJS Wallet{" "}
						<Tooltip
							label='Brief message about how PolkaJS Wallet works'
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
						<Link href='./' minWidth='30%'>
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
						<Link href='./' minWidth='30%'>
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
					</Stack>
				</Box>
			</Route>
			<Footer />
		</React.Fragment>
	);
};

export default WalletConnect;
