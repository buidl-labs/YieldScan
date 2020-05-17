const currency = "KSM";
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

const textColor = { light: "#2D3748", dark: "#FFF" };
const textColorLight = { light: "#677793", dark: "#ADB8CD" };
const border = { light: "#EEF2F9", dark: "#262E3E" };
const primaryColor = "#19CC95";
const primaryColorHighlight = "#19CC9533";
const validatorFilters = [
	{
		label: "No. of Nominators",
		type: "range",
		values: [1, 1000],
		min: 1,
		max: 1000
	},
	{
		label: "Own Stake",
		type: "range",
		values: [0, 80],
		min: 0,
		max: 80,
		unit: currency
	},
	{
		label: "Other Stake",
		type: "range",
		values: [0, 150],
		min: 0,
		max: 150,
		unit: currency
	},
	{
		label: "Commission",
		type: "range",
		values: [0, 100],
		min: 0,
		max: 100,
		unit: "%"
	},
	{
		label: "Max. Risk Level",
		type: "slider",
		values: [100],
		min: 0,
		max: 100
	}
];

export {
	currency,
	LOW_RISK,
	HIGH_RISK,
	getRiskLevelColor,
	getRiskSliderColor,
	getRiskLevel,
	textColor,
	textColorLight,
	border,
	primaryColor,
	primaryColorHighlight,
	validatorFilters
};
