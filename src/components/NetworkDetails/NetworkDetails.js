import React from "react";
import { Route } from "react-router-dom";
import { Box, Heading, Flex, PseudoBox } from "@chakra-ui/core";
import Helmet from "react-helmet";
import axios from "axios";
import Footer from "../Footer.jsx";
import {
	textColor,
	border,
	primaryColor,
	primaryColorHighlight
} from "../../constants";
import Filter from "./Filter";
import ValidatorsTable from "./ValidatorsTable";
import NominatorsTable from "./NominatorsTable";

type NetworkDetailsProps = {
	colorMode?: "light" | "dark",
	currency: string
};

const NetworkDetails = (props: NetworkDetailsProps) => {
	const mode = props.colorMode ? props.colorMode : "light";
	const [nominators, setNominators] = React.useState([
		{ "Nominator": "", "Total Stake": "", "Backers": "" }]);

	React.useEffect ( () => {
		axios.get('https://polka-analytic-api.herokuapp.com/nominatorsinfo')
			.then(response => {
				const nominators = response.data.reduce((acc, cur) => {
					acc.push({
						Nominator: `Nominator(...${cur.nominatorId.slice(-5)})`,
						"Total Stake": cur.totalStaked,
						Backers: cur.backers
					});
					return acc;
				}, [])
				setNominators(nominators);
			})
			.catch(error => {
				console.error(error);
			});
	}, []);


	const [filters, setFilters] = React.useState([
		{
			label: "No. of Validators",
			type: "range",
			values: [100, 900],
			min: 10,
			max: 1000
		},
		{
			label: "Total Stake",
			type: "range",
			values: [10, 40],
			min: 0,
			max: 50,
			unit: props.currency
		},
		{
			label: "Self Stake",
			type: "range",
			values: [10, 40],
			min: 0,
			max: 50,
			unit: props.currency
		},
		{
			label: "Other Stake",
			type: "range",
			values: [10, 40],
			min: 0,
			max: 50,
			unit: props.currency
		},
		{
			label: "Commission",
			type: "range",
			values: [10, 40],
			min: 0,
			max: 50,
			unit: props.currency
		},
		{
			label: "Min. Expected Daily Earning",
			type: "slider",
			values: [25],
			min: 0,
			max: 50,
			unit: props.currency
		},
		{
			label: "Max. Risk Level",
			type: "slider",
			values: [25],
			min: 0,
			max: 100
		}
	]);

	const [currentTab, setCurrentTab] = React.useState("Validators");

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
