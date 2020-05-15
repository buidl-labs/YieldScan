import { WsProvider, ApiPromise } from "@polkadot/api";
import { web3Accounts, web3FromAddress } from "@polkadot/extension-dapp";
import keyring from "@polkadot/ui-keyring";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";

const SubmitStakingTransaction = ({
	stashId,
	controllerId,
	stakeAmount,
	validatorList
}) => {
	const amount = stakeAmount * 10 ** 12;
	const createApi = async () => {
		const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io/");
		const api = await ApiPromise.create({ provider: wsProvider });

		const getAddress = async () => {
			keyring.loadAll(
				{
					genesisHash: api.genesisHash,
					isDevelopment: true,
					ss58Format: 2,
					type: "ed25519"
				},
				await web3Accounts()
			);
			const pair = keyring.getPair(controllerId);
			const { address } = pair;
			return address;
		};

		const getInjector = async () => {
			const address = await getAddress();
			const decoded = decodeAddress(address);
			const encodedAddress = encodeAddress(decoded, 42);
			const injector = await web3FromAddress(encodedAddress);
			console.log(`\nInjector: ${JSON.stringify(injector, null, 4)}`);
			return injector;
		};

		const batchTransactions = async () => {
			const ledger = await api.query.staking.ledger(stashId);
			const txs = [
				!ledger
					? api.tx.staking.bond(stashId, amount, 0)
					: api.tx.staking.bondExtra(amount),
				validatorList && api.tx.staking.nominate(validatorList)
			];
			return txs;
		};

		const submitTransactions = async () => {
			const injector = await getInjector();
			api.setSigner(injector.signer);
			const txs = await batchTransactions();
			api.tx.utility.batch(txs).signAndSend(controllerId, ({ status }) => {
				if (status.isInBlock) {
					console.log(`included in ${status.asInBlock}`);
				}
			});
		};
		submitTransactions();
	};
	createApi();
};

export default SubmitStakingTransaction;
