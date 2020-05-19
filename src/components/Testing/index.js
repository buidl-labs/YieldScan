import React from "react";
import { WsProvider, ApiPromise } from "@polkadot/api";
import { web3FromAddress, web3Enable } from "@polkadot/extension-dapp";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import CustomButton from "../CustomButton";

const createAPI = async () => {
	const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io/");
	const api = await ApiPromise.create({ provider: wsProvider });
	return api;
};

const Testing = props => {
	// Variables to change
	const STASH_ID = props.stashId;
	const CONTROLLER_ID = props.controllerId;
	const DECODED_CONTROLLER = props.controllerId
		? decodeAddress(CONTROLLER_ID)
		: "";
	const KUSAMA_CONTROLLER = props.controllerId
		? encodeAddress(DECODED_CONTROLLER, 2)
		: "";
	const VALIDATOR_LIST = props.validatorList;
	const STAKE_AMOUNT = props.stakeAmount;
	const AMOUNT = STAKE_AMOUNT * 10 ** 12;
	const submitTransaction = async () => {
		const api = await createAPI();
		// const myinjectedAddress = await web3Accounts();`
		const allInjected = await web3Enable("YieldScan");
		const injector = await web3FromAddress(CONTROLLER_ID);
		console.log(
			`injector: ${JSON.stringify(
				injector,
				null,
				4
			)}\ncontroller: ${CONTROLLER_ID}`
		);
		api.setSigner(injector.signer);
		const ledger = await api.query.staking.ledger(STASH_ID);
		// Get controller nonce to batch transactions without failing
		const { nonce } = await api.query.system.account(KUSAMA_CONTROLLER);
		console.log(`CONTROLLER NONCE: ${JSON.stringify(nonce, null, 4)}`);
		console.log(ledger);
		const txs = [
			!ledger
				? api.tx.staking.bond(STASH_ID, AMOUNT, 0)
				: api.tx.staking.bondExtra(AMOUNT),
			VALIDATOR_LIST && api.tx.staking.nominate(VALIDATOR_LIST)
		];
		console.log(txs);
		txs[0].signAndSend(CONTROLLER_ID, ({ status }) => {
			if (status.isInBlock) {
				console.log(`bonded in ${status.asInBlock}`);
			}
		});
		txs[1].signAndSend(
			CONTROLLER_ID,
			{ nonce: parseInt(nonce, 10) + 1 },
			({ status }) => {
				if (status.isInBlock) {
					console.log(`nominated in ${status.asInBlock}`);
				}
			}
		);
		// api.tx.utility.batch(txs).signAndSend(CONTROLLER_ID, ({ status }) => {
		// 	console.log(`status: ${JSON.stringify(status, null, 4)}`)
		// 	if (status.isInBlock) {
		// 		console.log(`included in ${status.asInBlock}`);
		// 	}
		// });
		// console.log(injected);
	};
	return (
		<CustomButton onClick={submitTransaction} disable={props.disable}>
			Testing Playground
		</CustomButton>
	);
};
export default Testing;
