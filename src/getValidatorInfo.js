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
			acc.push({
				Validator: cur.name
					? cur.name
					: `Validator (...${cur.stashId.slice(-5)})`,
				stashId: cur.stashId,
				totalStake: cur.totalStake,
				predictedPoolReward: 300,
				"No. of Nominators": cur.noOfNominators,
				"Other Stake": parseFloat(
					cur.totalStake - cur.currentValidator.exposure.own / 10 ** 12
				).toFixed(2),
				"Own Stake": parseFloat(
					cur.currentValidator.exposure.own / 10 ** 12
				).toFixed(2),
				Commission: cur.commission / 10 ** 7,
				"Risk Score":
					currentValidator && currentValidator.riskScore
						? currentValidator.riskScore
						: "-"
			});
			return acc;
		}, []);
	} catch (error) {
		console.error(error);
	}
	return validatorsInfo.slice(0, 40);
};

export default getValidatorInfo;
