const LOW_RISK = 0.25;
const MED_RISK = 0.5;
const HIGH_RISK = 1;

const getRiskLevelColor = risk => {
	if (risk < LOW_RISK) {
		return "green";
	}
	if (risk < MED_RISK) {
		return "yellow";
	}
	if (risk < HIGH_RISK) {
		return "red";
	}
	return "gray";
};

const getRiskLevel = risk => {
	if (risk < LOW_RISK) {
		return "LOW";
	}
	if (risk < MED_RISK) {
		return "MEDIUM";
	}
	if (risk < HIGH_RISK) {
		return "HIGH";
	}
	return "UNKNOWN";
};

const getRiskSliderColor = risk => {
	if (risk < LOW_RISK) {
		return "green.300";
	}
	if (risk < MED_RISK) {
		return "yellow.300";
	}
	if (risk < HIGH_RISK) {
		return "red.400";
	}
	return "gray.400";
};

const textColor = { light: "2D3748", dark: "#FFF" };
const textColorLight = { light: "#677793", dark: "#ADB8CD" };
const border = { light: "#EEF2F9", dark: "#262E3E" };

export {
	LOW_RISK,
	HIGH_RISK,
	getRiskLevelColor,
	getRiskSliderColor,
	getRiskLevel,
	textColor,
	textColorLight,
	border
};
