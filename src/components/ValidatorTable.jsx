import React from "react";
import { Link as RouterLink, Redirect } from "react-router-dom";
import { Table } from "antd";
import {
	IconButton,
	useToast,
	PopoverTrigger,
	Popover,
	PopoverArrow,
	PopoverHeader,
	PopoverContent,
	PopoverBody,
	Text,
	Link
} from "@chakra-ui/core";
import {
	Amplitude,
  } from "@amplitude/react-amplitude";

export default function ValidatorTable(props) {
	const [activePopover, setActivePopover] = React.useState("");
	const [redirect, setRedirect] = React.useState(false);
	const [validatorPath, setValidatorPath] = React.useState("");
	const { dataSource } = props;
	const { Column } = Table;
	const toast = useToast();
	return (
		<React.Fragment>
			{redirect ? <Redirect to={validatorPath} /> : ""}
			<Amplitude>
				{({logEvent}) => (
					<div style={{overflowX: 'auto'}}>
						<Table
							className={props.colorMode === "light" ? "table-light" : "table-dark"}
							rowKey="stashId"
							dataSource={dataSource}
							pagination={false}
							onRow={record => {
								return {
									onClick: () => {
										setValidatorPath(`/kusama/validator/${record.stashId}`);
										setRedirect(true);
									}
								};
							}}
						>
						<Column title="Name" key="name" dataIndex="name" align="left" />
						<Column
							title={() => (
								<React.Fragment>
									<Popover
										isOpen={activePopover === "dailyEarning"}
										trigger="hover"
									>
										<PopoverTrigger>
											<Text>Daily Earning</Text>
										</PopoverTrigger>
										<PopoverContent border="0" zIndex={1000}>
											<PopoverArrow />
											<PopoverHeader>Daily Earning</PopoverHeader>
											<PopoverBody>
												<Text fontSize="md" fontWeight="normal" mb={4}>
													Daily earning is the our approximate prediction (actual
													values may vary) on the amount of KSM tokens you could
													earn after 1 day based on the stake amount you enter
												</Text>
												<Link
													color="teal.500"
													fontWeight="normal"
													fontSize="md"
													href="https://hackmd.io/-k2e9Xy0RCarSK8PIJjYuA#How-does-the-reward-prediction-logic-work"
													isExternal
												>
													How are these values calculated?
												</Link>
											</PopoverBody>
										</PopoverContent>
									</Popover>
								</React.Fragment>
							)}
							key="dailyEarning"
							dataIndex="dailyEarning"
							align="left"
							defaultSortOrder="descend"
							sorter={(a, b) =>
								a.dailyEarning.slice(0, -5) - b.dailyEarning.slice(0, -5)
							}
							onHeaderCell={column => {
								return {
									onMouseEnter: () => {
										setActivePopover(column.dataIndex);
									},
									onMouseLeave: () => {
										setActivePopover("");
									}
								};
							}}
						/>
						<Column
							title={() => (
								<React.Fragment>
									<Popover isOpen={activePopover === "commission"} trigger="hover">
										<PopoverTrigger>
											<Text>Commission</Text>
										</PopoverTrigger>
										<PopoverContent border="0" zIndex={1000}>
											<PopoverArrow />
											<PopoverHeader>Commission</PopoverHeader>
											<PopoverBody>
												<Text fontSize="md" fontWeight="normal" mb={4}>
													Commission is the percentage of reward (set by the
													validator) that the validator will keep and the rest will
													be shared among them and their nominators
												</Text>
												<Link
													color="teal.500"
													fontSize="md"
													fontWeight="normal"
													href="https://guide.kusama.network/en/latest/try/validate/#validate"
													isExternal
												>
													Go to Kusama Guide
												</Link>
											</PopoverBody>
										</PopoverContent>
									</Popover>
								</React.Fragment>
							)}
							key="commission"
							dataIndex="commission"
							align="left"
							onHeaderCell={column => {
								return {
									onMouseEnter: () => {
										setActivePopover(column.dataIndex);
									},
									onMouseLeave: () => {
										setActivePopover("");
									}
								};
							}}
						/>
						<Column
							title={() => (
								<React.Fragment>
									<Popover
										isOpen={activePopover === "stashIdTruncated"}
										trigger="hover"
									>
										<PopoverTrigger>
											<Text>Stash Id</Text>
										</PopoverTrigger>
										<PopoverContent border="0" zIndex={1000}>
											<PopoverArrow />
											<PopoverHeader>Stash Id</PopoverHeader>
											<PopoverBody>
												<Text fontSize="md" fontWeight="normal" mb={4}>
													This is the stash id of the validator.
												</Text>
												<Link
													color="teal.500"
													fontSize="md"
													fontWeight="normal"
													as={RouterLink}
													to="/help-center/guides/how-to-stake"
												>
													Learn more on our staking guide
												</Link>
											</PopoverBody>
										</PopoverContent>
									</Popover>
								</React.Fragment>
							)}
							key="stashIdTruncated"
							dataIndex="stashIdTruncated"
							align="left"
							onHeaderCell={column => {
								return {
									onMouseEnter: () => {
										setActivePopover(column.dataIndex);
									},
									onMouseLeave: () => {
										setActivePopover("");
									}
								};
							}}
						/>
						<Column
							title={() => (
								<React.Fragment>
									<Popover isOpen={activePopover === "action"} trigger="hover">
										<PopoverTrigger>
											<Text>Copy Address</Text>
										</PopoverTrigger>
										<PopoverContent border="0" zIndex={1000}>
											<PopoverArrow />
											<PopoverBody>
												<Text fontSize="md" fontWeight="normal" textAlign="left">
													Click on the icon to copy validator's stash id
												</Text>
											</PopoverBody>
										</PopoverContent>
									</Popover>
								</React.Fragment>
							)}
							key="action"
							align="center"
							onHeaderCell={column => {
								return {
									onMouseEnter: () => {
										setActivePopover(column.key);
									},
									onMouseLeave: () => {
										setActivePopover("");
									}
								};
							}}
							render={record => (
								<React.Fragment>
									<IconButton
										ml={4}
										icon="copy"
										onClick={() => {
											logEvent(`Validator Address Copied for ${record.name} with id ${record.stashId}`);
											navigator.clipboard.writeText(record.stashId).then(
												() =>
													toast({
														title: "Validator Address Copied",
														description: `The Stash Id of ${record.name} has been copied to your clipboard`,
														status: "success",
														duration: 5000,
														isClosable: true
													}),
												() => console.log(`Something went wrong`)
											);
										}}
									/>
								</React.Fragment>
							)}
						/>
					</Table>
				</div>
				)}
			</Amplitude>
		</React.Fragment>
	);
}
