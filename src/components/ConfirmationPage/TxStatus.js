import React from "react";
import {
	CircularProgress,
	Text,
	Box,
	Link,
	Heading,
	Image,
	Alert,
	AlertDescription,
	AlertIcon
} from "@chakra-ui/core";
import { useHistory } from "react-router-dom";
import CustomButton from "../CustomButton";

const TxStatus = props => {
	const history = useHistory();
	const { txStatus, txBlock, handleSubmit, isSubmitted } = props;
	const isLoading = !isSubmitted;
	const blockHash =
        txStatus && txStatus.isFinalized ? txStatus.asFinalized : null;
    const blockNumber = txBlock && txBlock.header.number;

	if (isLoading || !blockHash) {
		return (
			<Box mt={24} textAlign='center'>
				<CircularProgress
					isIndeterminate
					as='span'
					color='brand'
					size='36px'
					alignSelf='center'
				/>
				<Text mt={4} fontSize='xl' color='gray.500'>
					Submitting transaction...
				</Text>
			</Box>
		);
	}
	if (blockHash) {
		return (
			<Box alignSelf='center' mt={24} textAlign='center'>
				<Image
					mx='auto'
					htmlWidth='100px'
					src='./MoneybagGraphic.svg'
					alt='Wallet Connect Illustration'
					mb={8}
				/>
				<Box mb={8}>
					<Heading>Transaction submitted</Heading>
					<Text>Please check the status of the transaction below</Text>
				</Box>
				<Link
					href={`https://polkascan.io/kusama/block/${blockNumber}`}
					color='teal.500'
					isExternal
				>
					View block on Polkascan
				</Link>
			</Box>
		);
	}
	return (
		<Box maxW='960px' mx='auto' mt={24} textAlign='center'>
			<Alert status='error'>
				<AlertIcon />
				<AlertDescription>
					Couldn't find transaction hash, this might be because transaction
					failed to submit
				</AlertDescription>
			</Alert>
			<Box mt={8}>
				<CustomButton
					onClick={() => {
						handleSubmit(false);
						history.push("/returns-calculator");
					}}
				>
					Return to calculator
				</CustomButton>
			</Box>
		</Box>
	);
};

export default TxStatus;
