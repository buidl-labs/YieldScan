import React from "react";
import { PseudoBox } from "@chakra-ui/core";

const colorScheme = {
	primary: {
		bg: "#19CC95",
		color: "#FFF",
		hoverBg: "#14AC7D"
	},
	secondary: {
		bg: "#4A5567",
		color: "#FFF",
		hoverBg: "#2F3745"
	},
	white: {
		bg: "#FFF",
		color: "#19CC95",
		hoverBg: "#EEE"
	}
};

type CustomButtonProps = {
	variant?: "primary" | "secondary" | "white",
	disable?: Boolean
};

const CustomButton = (props: CustomButtonProps) => {
	const variant = props.variant ? props.variant : "primary";
	return (
		<>
			<PseudoBox
				as='button'
				transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
				px={8}
				py={3}
				m={1}
				rounded='50px'
				fontSize='md'
				outline='none'
				fontWeight='semibold'
				bg={colorScheme[variant].bg}
				color={colorScheme[variant].color}
				_hover={{ bg: colorScheme[variant].hoverBg }}
				_active={{
					bg: colorScheme[variant].hoverBg,
					transform: "scale(0.96)",
					borderColor: "#bec3c9"
				}}
				_focus={{
					boxShadow:
						"0 0 1px 4px rgba(25, 204, 149, .5), 0 1px 1px rgba(0, 0, 0, .15)"
				}}
				disabled={props.disable}
				_disabled={{
					pointerEvents: "none",
					opacity: "0.5"
				}}
			>
				{props.children}
			</PseudoBox>
		</>
	);
};

export default CustomButton;
