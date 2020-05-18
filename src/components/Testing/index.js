import React, { useState } from "react";
import { WsProvider, ApiPromise } from "@polkadot/api";
import {
	web3Accounts,
	web3FromAddress,
	web3FromSource,
	web3Enable
} from "@polkadot/extension-dapp";
import keyring from "@polkadot/ui-keyring";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";

const createAPI = async () => {
	const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io/");
	const api = await ApiPromise.create({ provider: wsProvider });

	return api;
};

const Testing = props => {
	// Variables to change
	const STASH_ID = "5CyDnRowNh8ov8g3mY2oSuyesS7fg6RfWb112JrXzbkANtLm";
	const CONTROLLER_ID = "5CyDnRowNh8ov8g3mY2oSuyesS7fg6RfWb112JrXzbkANtLm";

	const VALIDATOR_LIST = [
		"D3bm5eAeiRezwZp4tWTX4sZN3u8nXy2Fo21U59smznYHu3F",
		"J4hAvZoHCviZSoPHoSwLida8cEkZR1NXJcGrcfx9saHTk7D",
		"G2VeiHKf8pna2NRpdQ47XoRc4LL4ezQHABPmh865VSN7rTD",
		"DrkY92Yq67zJ7T8XWN7SAXbnNDJhzkADutwhhhPyW3tQKTw",
		"F7Wa1su7NRSr6LWuhPWdXcQALDyzm8Vmev7WtV5jVPtJELs",
		"FzBBpxixSuZkeXxXeiUbvFYxcd3JAP5BEAcgDuhRudJTwmZ",
		"FDDy3cQa7JXiChYU2xq1B2WUUJBpZpZ51qn2tiN1DqDMEpS",
		"GCiTn1UJQT9TE5iamqoKweVoWGRZr9DF8uKXL4cG98fXczf",
		"DKUQiUWNPGvGYrgaxWqduJVRqWUYXUeKprX9EJENhxYvVyS",
		"GC8hwHbQ4TdbYJJPDS96G7Uj9bivnW5z56UEkqujjwhQPp5",
		"FSfBJoCU9sRhCYWwQ55iBNGU5L8eu56iGnYGK9zizHxu8dY",
		"G7eJUS1A7CdcRb2Y3zEDvfAJrM1QtacgG6mPD1RsPTJXxPQ",
		"EqyCQvYn1cHBdzFVQHQeL1nHDcxHhjWR8V48KbDyHyuyCGV",
		"Gt6HqWBhdu4Sy1u8ASTbS1qf2Ac5gwdegwr8tWN8saMxPt5",
		"CzugcapJWD8CEHBYHDeFpVcxfzFBCg57ic72y4ryJfXUnk7",
		"H9R6HgnZKtrcfBJP2M6WCvLJvp72Q96eURbCxmj6KCFVWjh"
	];

	const STAKE_AMOUNT = 0.01;
	const AMOUNT = STAKE_AMOUNT * 10 ** 12;

	const submitStakeOnBestValidators = async () => {
		const api = await createAPI();

		const allInjected = await web3Enable("YieldScan");

		// const myinjectedAddress = await web3Accounts();`

		const injector = await web3FromAddress(CONTROLLER_ID);

		console.log(injector);

		api.setSigner(injector.signer);

		const ledger = await api.query.staking.ledger(STASH_ID);

		console.log(ledger);

		const txs = [
			!ledger
				? api.tx.staking.bond(STASH_ID, AMOUNT, 0)
				: api.tx.staking.bondExtra(AMOUNT),
			VALIDATOR_LIST && api.tx.staking.nominate(VALIDATOR_LIST)
		];

		console.log(txs);

		api.tx.utility.batch(txs).signAndSend(CONTROLLER_ID, ({ status }) => {
			if (status.isInBlock) {
				console.log(`included in ${status.asInBlock}`);
			}
		});

		// console.log(injected);
	};

	return (
		<button onClick={submitStakeOnBestValidators}>Testing Playground</button>
	);
};

export default Testing;
