import React from "react";
import { Route } from "react-router-dom";
import {
	Box,
	Heading,
	Text,
	Link,
	Icon,
	ButtonGroup,
	Flex,
	PseudoBox
} from "@chakra-ui/core";
import Helmet from "react-helmet";
import Footer from "../Footer.jsx";
import Table from "../EditValidators/Table";
import {
	textColor,
	textColorLight,
	border,
	primaryColor,
	primaryColorHighlight
} from "../../constants";
import Filter from "./Filter";

type NetworkDetailsProps = {
	colorMode?: "light" | "dark"
};

const NetworkDetails = (props: NetworkDetailsProps) => {
	const [validators, setValidators] = React.useState([
		{
			Validator: "PolyLabs I",
			"Other Stake": "13.4525 KSM",
			"Own Stake": "13 KSM",
			Commission: "4%",
			"Risk Score": 0.34,
			selected: true
		},
		{
			Validator: "PolyLabs I",
			"Other Stake": "13.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "5%",
			"Risk Score": 0.14,
			selected: true
		},
		{
			Validator: "PolyLabs I",
			"Other Stake": "124.4525 KSM",
			"Own Stake": "15 KSM",
			Commission: "3%",
			"Risk Score": 0.22,
			selected: true
		},
		{
			Validator: "PolyLabs I",
			"Other Stake": "13.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "2%",
			"Risk Score": 0.15,
			selected: true
		},
		{
			Validator: "PolyLabs I",
			"Other Stake": "53.4525 KSM",
			"Own Stake": "12 KSM",
			Commission: "3%",
			"Risk Score": 0.64,
			selected: true
		}
	]);

	const [currentTab, setCurrentTab] = React.useState("Validators");

	const mode = props.colorMode ? props.colorMode : "light";

	const sortList = (column, asc) => {
		let tempValidators = [...validators];
		if (asc) {
			tempValidators = tempValidators.sort((a, b) =>
				a[column] > b[column] ? 1 : b[column] > a[column] ? -1 : 0
			);
		} else {
			tempValidators = tempValidators.sort((a, b) =>
				a[column] > b[column] ? -1 : b[column] > a[column] ? 1 : 0
			);
		}
		setValidators(tempValidators);
	};

	return (
		<>
			<Helmet>
				<title>Yield Scan &middot; Network Details</title>
			</Helmet>
			<Route exact path='/network-details-demo'>
				<Box w='100%'>
					<Heading as='h3' size='xl' color={textColor[mode]} my={4} mt={8}>
						Network Details
					</Heading>
					<Flex wrap='wrap' my={8}>
						<PseudoBox
							as='b'
							py={2}
							px={4}
							transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
							borderWidth='1px'
							borderColor={border[mode]}
							roundedTopLeft='20px '
							roundedBottomLeft='20px '
							fontSize='sm'
							cursor='pointer'
							color={currentTab === "Validators" ? "#FFF" : textColor[mode]}
							bg={
								currentTab === "Validators"
									? primaryColor
									: "rgba(255,255,255,0)"
							}
							_hover={{
								bg: currentTab === "Validators" ? primaryColor : border[mode]
							}}
							boxShadow={
								currentTab === "Validators"
									? `0 0 0 0.2rem ${primaryColorHighlight}`
									: "none"
							}
							onClick={() => {
								setCurrentTab("Validators");
							}}
						>
							Validators
						</PseudoBox>
						<PseudoBox
							as='b'
							py={2}
							px={4}
							transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
							borderWidth='1px'
							borderColor={border[mode]}
							roundedTopRight='20px'
							roundedBottomRight='20px'
							fontSize='sm'
							cursor='pointer'
							color={currentTab === "Nominators" ? "#FFF" : textColor[mode]}
							bg={
								currentTab === "Nominators"
									? primaryColor
									: "rgba(255,255,255,0)"
							}
							_hover={{
								bg: currentTab === "Nominators" ? primaryColor : border[mode]
							}}
							boxShadow={
								currentTab === "Nominators"
									? `0 0 0 0.2rem ${primaryColorHighlight}`
									: "none"
							}
							onClick={() => {
								setCurrentTab("Nominators");
							}}
						>
							Nominators
						</PseudoBox>
					</Flex>
					<Flex mt={8}>
						<Box w='calc(70% - 20px)' m='10px' overflow='auto'>
							<Box w={["300%", "200%", "100%", "100%"]}>
								<Table
									colorMode={mode}
									columns={[
										"Validator",
										"Other Stake",
										"Own Stake",
										"Commission",
										"Risk Score"
									]}
									rows={validators}
									sortableColumns={[
										"Other Stake",
										"Own Stake",
										"Commission",
										"Risk Score"
									]}
									sortCallback={sortList}
								></Table>
							</Box>
						</Box>
						<Box w='calc(30% - 20px)' m='10px'>
							<Filter colorMode={mode}></Filter>
						</Box>
					</Flex>
				</Box>
			</Route>
			<Footer />
		</>
	);
};

export default NetworkDetails;
