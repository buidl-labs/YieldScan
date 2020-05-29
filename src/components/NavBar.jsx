import React, {  } from "react";
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
	Icon,
} from '@chakra-ui/core'
import { NavLink } from 'react-router-dom'
import { AiOutlineMenu } from 'react-icons/ai'

export default () => {
	const { colorMode, toggleColorMode } = useColorMode()
	const { isOpen, onOpen, onClose } = useDisclosure()

	const btnRef = React.useRef()

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
								YieldScan
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
						<Box mr={8}>
							<Link
								as={NavLink}
								className="nav-link"
								to="/network-details"
							>
								Network Details
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
							<DrawerHeader>YieldScan</DrawerHeader>

							<DrawerBody display="flex" flexDirection="column">
								
									<Link
										as={NavLink}
										className="nav-link"
										to="/network-details"
										py={2}
									>
										Network Details
									</Link>
								
								
									<Link
										as={NavLink}
										className="nav-link"
										to="/returns-calculator"
										py={2}
									>
										Returns Calculator
									</Link>
								
								
									{/* <Link
										as={NavLink}
										className="nav-link"
										to="/help-center"
										py={2}
									>
										Help Center
									</Link> */}
								
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
								</Button>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
				</Flex>
			</Flex>
		</React.Fragment>
	);
};
