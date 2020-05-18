import axios from "axios";

const getRiskScore = async () => {
	let riskInfo = [];
	try {
		const response = await axios.get(
			"https://polka-analytics-api-testing-sfgk.onrender.com/riskscore"
		);
		riskInfo = response.data;
	} catch (error) {
		console.error(error);
	}
	return riskInfo;
};

export default getRiskScore;
