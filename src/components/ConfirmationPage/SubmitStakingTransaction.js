import { WsProvider, ApiPromise } from "@polkadot/api";
import { web3Accounts, web3FromAddress } from "@polkadot/extension-dapp";
import keyring from "@polkadot/ui-keyring";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";

const SubmitStakingTransaction = async ({
	stashId,
	controllerId,
	stakeAmount,
	validatorList
}) => {
	try {
		console.log("stashId", stashId);
		console.log("controllerId", controllerId);
		console.log("stakeAmount", stakeAmount);
		console.log("validatorList", validatorList);

		const amount = stakeAmount * 10 ** 12;

		const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io/");
		const api = await ApiPromise.create({ provider: wsProvider });

		// Got Substrate Address
		const myinjectedAddress = await web3Accounts();

		console.log("checking what is inside web3Accounts");
		console.log(myinjectedAddress);

		console.log("Keyring before loading");
		console.log(keyring);
		keyring.loadAll(
			{
				genesisHash: api.genesisHash,
				isDevelopment: true,
				ss58Format: 2,
				type: "ed25519"
			},
			myinjectedAddress
		);

		console.log("After loading");
		console.log(keyring);

		const gotPairFromKeyRing = keyring.getPair(
			"5CyDnRowNh8ov8g3mY2oSuyesS7fg6RfWb112JrXzbkANtLm"
		);

		console.log(
			`gotPairFromKeyRing ${JSON.stringify(gotPairFromKeyRing, null, 4)}`
		);

		const { address } = gotPairFromKeyRing;

		console.log(`address: ${address}`);

		const decoded = decodeAddress(address);
		const encodedAddress = encodeAddress(decoded, 42);

		console.log(`encoded address: ${encodedAddress}`);

		const injector = await web3FromAddress(
			"5CyDnRowNh8ov8g3mY2oSuyesS7fg6RfWb112JrXzbkANtLm"
		);

		console.log(`\nInjector: ${JSON.stringify(injector, null, 4)}`);

		const ledger = await api.query.staking.ledger(stashId);

		// TODO: document this code for other readers.
		const txs = [
			!ledger
				? api.tx.staking.bond(stashId, amount, 0)
				: api.tx.staking.bondExtra(amount),
			validatorList && api.tx.staking.nominate(validatorList)
		];

		// api.setSigner(injector.signer);
		api.tx.utility.batch(txs).signAndSend(controllerId, ({ status }) => {
			if (status.isInBlock) {
				console.log(`included in ${status.asInBlock}`);
			}
		});
	} catch (err) {
		return err;
	}
};

export default SubmitStakingTransaction;
