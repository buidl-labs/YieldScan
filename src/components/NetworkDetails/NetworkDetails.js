import React from "react";
import { Route } from "react-router-dom";
import { Box, Heading, Flex, PseudoBox } from "@chakra-ui/core";
import Helmet from "react-helmet";
import Footer from "../Footer.jsx";
import {
	textColor,
	border,
	primaryColor,
	primaryColorHighlight,
	validatorFilters
} from "../../constants";
import Filter from "./Filter";
import ValidatorsTable from "./ValidatorsTable";
import NominatorsTable from "./NominatorsTable";
import getNominatorInfo from "../../getNominatorInfo";

type NetworkDetailsProps = {
	colorMode?: "light" | "dark",
	currency: string,
	validators: Array<{}>
};

const NetworkDetails = (props: NetworkDetailsProps) => {
	const mode = props.colorMode ? props.colorMode : "light";
	const { nominators } = props;

	const [filters, setFilters] = React.useState(validatorFilters);

	const [currentTab, setCurrentTab] = React.useState("Validators");

	return (
		<>
			<Helmet>
				<title>YieldScan &middot; Network Details</title>
			</Helmet>
			<Route exact path='/(|network-details)'>
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
					<Flex mt={8} wrap='wrap-reverse'>
						<Box
							w={
								currentTab === "Validators"
									? [
											"calc(100% - 20px)",
											"calc(100% - 20px)",
											"calc(75% - 20px)",
											"calc(75% - 20px)"
									  ]
									: "calc(100% - 20px)"
							}
							maxH='calc(100vh - 20px)'
							m='10px'
							overflow='auto'
						>
							<Box w={["300%", "200%", "100%", "100%"]}>
								{currentTab === "Validators" ? (
									<ValidatorsTable
										colorMode={mode}
										filters={filters}
										currency={props.currency}
										validators={props.validators}
										setFilters={setFilters}
									/>
								) : (
									<NominatorsTable
										colorMode={mode}
										currency={props.currency}
										nominators={nominators}
									/>
								)}
							</Box>
						</Box>
						{currentTab === "Validators" && (
							<Box
								w={[
									"calc(100% - 20px)",
									"calc(100% - 20px)",
									"calc(25% - 20px)",
									"calc(25% - 20px)"
								]}
								m='10px'
							>
								<Filter
									colorMode={mode}
									filters={filters}
									callback={setFilters}
								></Filter>
							</Box>
						)}
					</Flex>
				</Box>
			</Route>
			<Footer />
		</>
	);
};

export default NetworkDetails;
