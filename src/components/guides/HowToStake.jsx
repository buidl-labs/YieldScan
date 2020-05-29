import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Heading, Text, Link, Icon, Box, Button } from "@chakra-ui/core";
import {
	VerticalTimeline,
	VerticalTimelineElement
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import LogEvent from "../LogEvent";
import Helmet from "react-helmet";

export default function HowToStake() {
	return (
		<Box mb={8}>
			<Helmet>
				<title>Yield Scan - How to stake - Guide - Help Center</title>

				<meta name='description' content='Validator key stats' />
			</Helmet>
			<LogEvent eventType='Staking guide view' />
			<Heading as='h2' size='xl' textAlign='center' mt={16}>
				How to stake?
			</Heading>
			<Text fontSize='2xl' textAlign='center' mb={16}>
				A step by step guide on how to stake KSM on the{" "}
				<Link href='https://kusama.network/' color='brand.500' isExternal>
					Kusama Network
				</Link>
			</Text>

			{/* Steps to stake */}
			<VerticalTimeline layout='1-column' className='py-0'>
				{/* Step 1: Create a stash account */}
				<VerticalTimelineElement
					contentStyle={{
						background: "transparent",
						paddingTop: 0,
						borderRadius: 0
					}}
					contentArrowStyle={{
						borderRight: "7px solid transparent"
					}}
					icon={
						<Heading as='h5' size='sm' color='white'>
							1
						</Heading>
					}
					iconStyle={{
						background: "#19cc95",
						display: "flex",
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					<Heading as='h3' size='lg'>
						Create a stash account
					</Heading>
					<Text>
						Stash account holds funds bonded for staking, but delegates some
						functions to a Controller. To create a stash account, head over to
						the Accounts section of the Polkadot UI. Click on the “Add account”
						button. This will open up a form with 5 fields. We’ll ignore the
						fields under the advanced creation options for the purpose of this
						tutorial. The first field asks for a “Name”. Enter whatever name you
						want the account to have. The second field contains an
						auto-generated “mnemonic seed”. Write this phrase down and keep it
						safe. Don’t share this with anyone as this will give them access to
						the funds in your account. Next, you need to choose a strong
						password. We highly recommend using a password generator to generate
						a strong password. Needless to say, keep this information safe and
						secret as well. Now, click on the “Save” button. This will open up a
						dialog which will ask you to save the backup file for your account
						in a secure location along with your password as this will allow you
						to restore your account. Go ahead and click the “Create and backup
						account” button. This will open a download dialog on your browser.
						Choose a secure location to store this file and click “Save File”.
						Your stash account is created and a backup file has been stored your
						your selected location.
					</Text>
				</VerticalTimelineElement>

				{/* Step 2: Create a controller account */}
				<VerticalTimelineElement
					contentStyle={{
						background: "transparent",
						paddingTop: 0,
						borderRadius: 0
					}}
					contentArrowStyle={{
						borderRight: "7px solid transparent"
					}}
					icon={
						<Heading as='h5' size='sm' color='white'>
							2
						</Heading>
					}
					iconStyle={{
						background: "#19cc95",
						display: "flex",
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					<Heading as='h3' size='lg'>
						Create a controller account
					</Heading>
					<Text>
						Controller account acts on behalf of the Stash account, signalling
						decisions about nominating and validating. It sets preferences like
						payout account and commission. It only needs enough funds to pay
						transaction fees. The steps to create a controller account are
						identical to creating a stash account. The only difference is in the
						usage. For now, just repeat the steps that were used to create the
						stash account.
					</Text>
				</VerticalTimelineElement>

				{/* CTA: Ready to stake? */}
				<VerticalTimelineElement
					contentStyle={{
						background: "transparent",
						paddingTop: 0,
						borderRadius: 0
					}}
					contentArrowStyle={{
						borderRight: "7px solid transparent"
					}}
					icon={<Icon name='check' color='white' />}
					iconStyle={{
						background: "#19cc95"
					}}
				>
					<Heading as='h3' size='lg'>
						Ready to stake?
					</Heading>
					<Button
                        mt={8}
                        px={8}
                        rounded='4rem'
						variant='solid'
                        variantColor='brand'
						as={RouterLink}
						to='/returns-calculator'
					>
						Calculate your expected earning
					</Button>
					<Text fontWeight='light' fontSize='sm'>
						For instructions on how to use the returns calculator, visit{" "}
						<Link
							href='https://github.com/buidl-labs/YieldScan/wiki/Returns-Calculator'
							color='brand.500'
							isExternal
						>
							returns calculator wiki
						</Link>
					</Text>
				</VerticalTimelineElement>
			</VerticalTimeline>
		</Box>
	);
}
