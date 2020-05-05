import React, { useEffect, useState } from "react";
import {
	Flex,
	useDisclosure,
	Box,
	Image,
	Heading,
	Link,
	IconButton,
	useColorMode,
	Button,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	Text,
	Icon,
	MenuItem,
	MenuButton,
	Menu,
	MenuList,
} from '@chakra-ui/core'
import { NavLink } from 'react-router-dom'
import { AiOutlineMenu } from 'react-icons/ai'
import {
	web3Enable,
	isWeb3Injected,
	web3AccountsSubscribe,
} from '@polkadot/extension-dapp'

import Identicon from "@polkadot/react-identicon";

export default ({ onExtensionDialogOpen, onCreateAccountDialogOpen }) => {
	const { colorMode, toggleColorMode } = useColorMode()
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [isUserLoggedIn, setIsLoggedIn] = useState(false)
	const [listOfUsers, updateListOfUsers] = useState([])

	const btnRef = React.useRef()

	//check if user has at least one account with polkadot extension enabled
	useEffect(() => {
		// console.log('isWeb3Injected', isWeb3Injected);
		// connected to polkadot extension
		if (isWeb3Injected) {
			//connect to extension
			web3Enable('Polkanalytics')

			//subscriber to listen to change in extension accounts
			web3AccountsSubscribe(users => {
				console.log('values', users)
				if (users.length > 0) {
					/*
			Means user has at least setup on account,
			and store account info in localstorage for global reference
			*/
					setIsLoggedIn(true)
					updateListOfUsers(users)
					localStorage.setItem('users', JSON.stringify(users))
				} else {
					//user has no accounts setup/created
					updateListOfUsers(users)
					setIsLoggedIn(false)
					localStorage.setItem('users', JSON.stringify(users))
				}
			})
		}
	}, [])

	return (
		<React.Fragment>
			{/* Navbar */}
			<Flex direction='row' justifyContent='space-between' zIndex={999} p={2}>
				{/* Polka Analytics Logo - Left hand part of navbar */}
				<Flex justify='flex-start' alignItems='center'>
					<NavLink to='/'>
						<Box as='span' display='inline-flex' alignItems='center'>
							<Image src='/LogoYS.svg' height='2rem' mr={4} />
							<Heading
								as='h3'
								size='lg'
								display={{ base: "none", sm: "block" }}
							>
								Yield Scan
							</Heading>
						</Box>
					</NavLink>
				</Flex>
				{/* Navigation Menu & color mode toggle - Right hand part of navbar */}
				<Flex justify="flex-end">
					<Flex
						alignItems="center"
						display={{ base: 'none', sm: 'flex' }}
					>
						{/*	
						{isUserLoggedIn ? (
						<Box mr={8}>
							<Menu>
								<MenuButton
									as={Button}
									rightIcon="chevron-down"
								>
									Accounts
								</MenuButton>
								<MenuList
									style={{
									zIndex: 1000,
									overflowY: 'auto',
									}}
								>
									{listOfUsers.length > 0 &&
									listOfUsers.map(user => {
									return (
									<MenuItem
										key={user.address}
										minH="48px"
									>
										<Identicon
											value={user.address}
											size={36}
											theme="polkadot"
										/>
										<strong
											style={{
											marginLeft: 10,
											}}
										>
											{user.meta.name}
										</strong>
									</MenuItem>
									)
									})}
								</MenuList>
							</Menu>
						</Box>
						) : (
						<Box mr={8}>
							<Button
								style={{
								border: '1px solid #E50B7B',
								borderRadius: '18px',
								opacity: 1,
								color: '#E50B7B',
								height: '35px',
								}}
								onClick={() => {
								//if yes continue
								//Check if extension is available
								if (!isWeb3Injected) {
								//if not: show a dialog box with link to add extension
								//link to extension: https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd?hl=en
								//return and not continue with the code execution
								onExtensionDialogOpen()
								console.log(
								'add polkadot extensions'
								)
								return
								}

								if (listOfUsers.length <= 0) {
								onCreateAccountDialogOpen()
								}
								}}
							>
								Sign in / Sign up
							</Button>
						</Box>
						)}
						*/}
						<Box mr={8}>
							<Link
								as={NavLink}
								className="nav-link"
								to="/dashboard"
							>
								Dashboard
							</Link>
						</Box>
						<Box mr={8}>
							<Link
								as={NavLink}
								className="nav-link"
								to="/returns-calculator"
							>
								Returns Calculator
							</Link>
						</Box>
						<Box mr={8}>
							<Link
								as={NavLink}
								className="nav-link"
								to="/help-center"
							>
								Help Center
							</Link>
						</Box>
						<IconButton
							aria-label={
								colorMode === "light"
									? "Switch to dark mode"
									: "Switch to light mode"
							}
							icon={colorMode === "light" ? "moon" : "sun"}
							size='lg'
							onClick={toggleColorMode}
							backgroundColor={colorMode === "light" ? "#fff" : "gray.800"}
						/>
					</Flex>
					<IconButton
						ref={btnRef}
						icon={AiOutlineMenu}
						onClick={onOpen}
						display={{ base: "block", sm: "none" }}
						backgroundColor='transparent'
					/>
					<Drawer
						isOpen={isOpen}
						placement='right'
						onClose={onClose}
						finalFocusRef={btnRef}
						display={{ base: "block", sm: "none" }}
					>
						<DrawerOverlay />
						<DrawerContent>
							<DrawerCloseButton />
							<DrawerHeader>Polka Analytics</DrawerHeader>

							<DrawerBody>
								<Box mr={8}>
									<Link
										as={NavLink}
										className="nav-link"
										to="/dashboard"
										py={4}
									>
										Dashboard
									</Link>
								</Box>
								<Box mr={8}>
									<Link
										as={NavLink}
										className="nav-link"
										to="/returns-calculator"
										py={4}
									>
										Returns Calculator
									</Link>
								</Box>
								<Box mr={8}>
									<Link
										as={NavLink}
										className="nav-link"
										to="/help-center"
										py={4}
									>
										Help Center
									</Link>
								</Box>
							</DrawerBody>

							<DrawerFooter
								justifyContent='flex-start'
								alignItems='center'
								p={0}
							>
								<Button onClick={toggleColorMode} pl={6} width='100%'>
									<Icon
										size='16px'
										aria-label={
											colorMode === "light"
												? "Switch to dark mode"
												: "Switch to light mode"
										}
										name={colorMode === "light" ? "moon" : "sun"}
										mr={4}
									/>{" "}
									{colorMode === "light"
										? "Switch to dark mode"
										: "Switch to light mode"}
>>>>>>> develop
								</Button>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
				</Flex>
			</Flex>
		</React.Fragment>
	);
};
