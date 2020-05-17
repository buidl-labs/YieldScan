import axios from "axios";

const getRiskScore = async () => {
	let riskInfo = [];
	try {
		const response = await axios.get(
			"https://polka-analytics-api-testing-sfgk.onrender.com/validatorinfo"
		);
		riskInfo = response.data;
	} catch (error) {
		console.error(error);
	}
	return riskInfo.slice(0, 40);
};

export default getRiskScore;
