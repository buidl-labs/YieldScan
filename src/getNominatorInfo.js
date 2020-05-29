import axios from "axios";

const getNominatorInfo = async () => {
	let nominatorsInfo = [];
	try {
		const response = await axios.get(
			"https://polka-analytics-api-testing-sfgk.onrender.com/nominatorsinfo"
		);
		nominatorsInfo = response.data.reduce((acc, cur) => {
			const rawEarnings = cur.rewardsArr.reduce(
				(accumulator, current) => current.nomReward + accumulator,
				0
			);
			const parsedEarnings = (rawEarnings / 10 ** 12).toFixed(2);
			acc.push({
				id: cur.nominatorId ? cur.nominatorId : null,
				Nominator: `Nominator (...${cur.nominatorId.slice(-5)})`,
				"Total Staked": cur.totalStaked,
				Nominations: cur.backers,
				"Daily Earnings": parsedEarnings
			});
			return acc;
		}, []);
	} catch (error) {
		console.error(error);
	}
	return nominatorsInfo.slice(0, nominatorsInfo.length - 1);
};

export default getNominatorInfo;
