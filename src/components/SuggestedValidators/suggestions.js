const ERA_PER_DAY = 4;
const MAX_NOMINATIONS = 16;

const calculateRewards = (stakeAmount, validatorInfo) => {
	const { totalStake, predictedPoolReward } = validatorInfo;
	const userStakeFraction = stakeAmount / (stakeAmount + totalStake);
	const nextEraPredictedReward = userStakeFraction * predictedPoolReward;
	return isNaN(nextEraPredictedReward * ERA_PER_DAY)
		? "Not enough data"
		: nextEraPredictedReward * ERA_PER_DAY;
};

const getRewardsForValidatorsList = (validatorsList, stakeAmount) => {
	const rewards = validatorsList.map((validator, index) => {
		const expectedReward = calculateRewards(stakeAmount, validator);
		return {
			expectedReward,
			index
		};
	});
	return rewards;
};

const getHighestYieldInfo = (stakeAmount, validatorsList, nominations) => {
	const validatorRewards = getRewardsForValidatorsList(
		validatorsList,
		stakeAmount
	);
	validatorRewards.sort((a, b) => b.expectedReward - a.expectedReward);
	const filteredRewards = [...validatorRewards.slice(0, nominations)];
	const suggestedValidators = filteredRewards.map(
		reward => validatorsList[reward.index]
	);
	const expectedReturns = filteredRewards.reduce(
		(acc, curr) => curr.expectedReward + acc, 0
	);
	console.log(filteredRewards);
	return { suggestedValidators, expectedReturns };
};

const getSuggestions = (budget, risk, allValidators) => {
	const validatorsList = allValidators.filter(validator =>
		risk === 1
			? true
			: !isNaN(validator["Risk Score"]) && validator["Risk Score"] <= risk
	);
	const nominations =
		validatorsList.length > MAX_NOMINATIONS
			? MAX_NOMINATIONS
			: validatorsList.length;
	const stakeAmount = budget / nominations;
	const { suggestedValidators, expectedReturns } = getHighestYieldInfo(
		stakeAmount,
		validatorsList,
		nominations
	);
	return { suggestedValidators, expectedReturns };
};

export { getSuggestions, calculateRewards, getRewardsForValidatorsList };
