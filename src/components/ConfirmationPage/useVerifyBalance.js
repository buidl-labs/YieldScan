import { useState, useEffect } from "react";
import { WsProvider, ApiPromise } from "@polkadot/api";

const useVerifyBalance = ({
	stashId,
	controllerId,
	stakeAmount,
	validatorList
}) => {
	const [isEnough, setIsEnough] = useState(null);
	useEffect(() => {
		const createApi = async () => {
			const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io/");
			const api = await ApiPromise.create({ provider: wsProvider });

			const getAccountsFreeBalance = async () => {
				const stash = await api.query.system.account(stashId);
				const controller = await api.query.system.account(controllerId);
				const stashFreeBalance = stash && stash.data.free;
				const controllerFreeBalance = controller && controller.data.free;
				return {
					stash: stashFreeBalance,
					controller: controllerFreeBalance
				};
			};

			const getAccountsLockedBalance = async () => {
				const stashLocks = await api.query.balances.locks(stashId);
				const controllerLocks = await api.query.balances.locks(controllerId);
				return {
					stash: stashLocks.length > 0 ? stashLocks : 0,
					controller: controllerLocks.length > 0 ? controllerLocks : 0
				};
			};

			const getAccountsTransferableBalance = async () => {
				const freeBalance = await getAccountsFreeBalance();
				const locks = await getAccountsLockedBalance();

				return {
					stash: (freeBalance.stash - locks.stash) / 10 ** 12,
					controller: (freeBalance.controller - locks.controller) / 10 ** 12
				};
			};

			const isBalanceEnough = async () => {
				const transferableBalances = await getAccountsTransferableBalance();
				const stakingFee = await api.tx.staking
					.nominate(validatorList)
					.paymentInfo(controllerId);
				const bondingFee = await api.tx.staking
					.bond(controllerId, stakeAmount, 0)
					.paymentInfo(controllerId);
				const transactionFee =
					(2 * stakingFee.partialFee + 2 * bondingFee.partialFee) / 10 ** 12;
				const isStashBalanceEnough = transferableBalances.stash > stakeAmount;
				const isControllerBalanceEnough =
					transferableBalances.controller > transactionFee;
				return isStashBalanceEnough && isControllerBalanceEnough;
			};
			setIsEnough(await isBalanceEnough());
		};
		stashId !== undefined && controllerId !== undefined
			? createApi()
			: setIsEnough(false);
	}, [controllerId, setIsEnough, stakeAmount, stashId, validatorList]);
	console.log(isEnough);
	return isEnough;
};

export default useVerifyBalance;
