import { web3Enable, web3Accounts } from "@polkadot/extension-dapp";

export default async () => {
	const allInjected = await web3Enable("YieldScan");
	const isExtensionAvailable = allInjected.length > 0;
	const accounts = await web3Accounts();
	return { isExtensionAvailable, accounts };
};
