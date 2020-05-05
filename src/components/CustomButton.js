import React from "react";
import { PseudoBox } from "@chakra-ui/core";

type CustomButtonProps = {
	variant?: "primary" | "secondary"
};

const CustomButton = (props: CustomButtonProps) => {
	let variant = props.variant ? props.variant : "primary";
	return (
		<>
			<PseudoBox
				as='button'
				transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
				px={6}
				py={3}
				m={1}
				rounded='50px'
				fontSize='md'
				outline='none'
				fontWeight='semibold'
				bg={variant === "primary" ? "#19CC95" : "#4A5567"}
				color='#FFF'
				_hover={{ bg: variant === "primary" ? "#14AC7D" : "#2F3745" }}
				_active={{
					bg: variant === "primary" ? "#14AC7D" : "#2F3745",
					transform: "scale(0.96)",
					borderColor: "#bec3c9"
				}}
				_focus={{
					boxShadow:
						"0 0 1px 4px rgba(25, 204, 149, .5), 0 1px 1px rgba(0, 0, 0, .15)"
				}}
			>
				{props.children}
			</PseudoBox>
		</>
	);
};

export default CustomButton;
