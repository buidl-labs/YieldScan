import axios from "axios";
import getRiskScore from "./getRiskScore";

const getValidatorInfo = async () => {
	let validatorsInfo = [];
	const riskScores = await getRiskScore();
	try {
		const response = await axios.get(
			"https://polka-analytics-api-testing-sfgk.onrender.com/validatorinfo"
		);
		validatorsInfo = response.data.reduce((acc, cur) => {
			const currentValidator = riskScores.find(
				validator => validator.stashId === cur.stashId
			);
			const Validator = cur.name
					? cur.name
					: `Validator (...${cur.stashId.slice(-5)})`
			const poolReward =
				cur.rewards.length > 0
					? cur.rewards[cur.rewards.length - 1].poolReward / 10 ** 12
					: "Not enough data";
			const commission = cur.commission / 10 ** 7;
			const predictedPoolReward = isNaN(poolReward)
				? "Not enough data"
				: poolReward * (1 - commission / 100);
			acc.push({
				Validator,
				stashId: cur.stashId,
				totalStake: cur.totalStake,
				predictedPoolReward,
				"No. of Nominators": cur.noOfNominators,
				"Other Stake": parseFloat(
					cur.totalStake - cur.currentValidator.exposure.own / 10 ** 12
				).toFixed(2),
				"Own Stake": parseFloat(
					cur.currentValidator.exposure.own / 10 ** 12
				).toFixed(2),
				Commission: commission,
				"Risk Score":
					currentValidator && currentValidator.riskScore
						? currentValidator.riskScore.toFixed(2)
						: "-"
			});
			return acc;
		}, []);
	} catch (error) {
		console.error(error);
	}
	return validatorsInfo;
};

export default getValidatorInfo;
