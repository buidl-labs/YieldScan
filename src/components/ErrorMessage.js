import React from 'react'
import { Link as ChakraLink } from '@chakra-ui/core'

function ErrorMessage() {
    return (
			<div
				style={{
					display: "grid",
					justifyContent: "center",
					alignItems: "center",
					height: "calc(100vh - 40px)"
				}}
			>
				<p
					style={{
						fontSize: "30px",
						fontWeight: "bold",
						textAlign: "center",
						margin: 70
					}}
				>
					We are down right now, report it here{" "}
					<ChakraLink href='mailto:karan@buidllabs.io' color='teal.500'>
						karan@buidllabs.io
					</ChakraLink>{" "}
					we will be back soon.
				</p>
			</div>
		);
}

export default ErrorMessage
