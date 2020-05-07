const LOW_RISK = 0.25;
const MED_RISK = 0.5;
const HIGH_RISK = 1;

const getRiskLevelColor = risk => {
	if (risk < LOW_RISK) {
		return "green";
	} else if (risk < MED_RISK) {
		return "yellow";
	} else if (risk < HIGH_RISK) {
		return "red";
	} else {
		return "gray";
	}
};

const textColor = { light: "2D3748", dark: "#FFF" };
const textColorLight = { light: "#677793", dark: "#9DAECF" };
const border = { light: "#EEF2F9", dark: "#262E3E" };

export {
	LOW_RISK,
	HIGH_RISK,
	getRiskLevelColor,
	textColor,
	textColorLight,
	border
};
