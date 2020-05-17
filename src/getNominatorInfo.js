import axios from "axios";

const getNominatorInfo = async () => {
	let nominatorsInfo = [];
	try {
		const response = await axios.get(
			"https://polka-analytics-api-testing-sfgk.onrender.com/nominatorsinfo"
		);
		nominatorsInfo = response.data.reduce((acc, cur) => {
			acc.push({
				Nominator: `Nominator (...${cur.nominatorId.slice(-5)})`,
				"Total Staked": cur.totalStaked,
				Nominations: cur.backers
			});
			return acc;
		}, []);
	} catch (error) {
		console.error(error);
	}
	return nominatorsInfo.slice(0, 40);
};

export default getNominatorInfo;
