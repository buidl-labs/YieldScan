import React from 'react';
import {
	Box,
	Text,
	Heading,
	Link as ChakraLink,
  Button
} from "@chakra-ui/core";
function ErrorMessage() {
  return (
    <div
      style={{
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 40px)'
      }}
    >
    <Box>
      <div style={{textAlign:"center"}}>
     <Heading as="h1" size="xl">
				Error Loading The Page!
			</Heading>
      <Heading as="h3" size="l">
				Try reloading the page
			</Heading>
      <Button style={{marginTop: 10}} onClick={() => {
        window.location.reload();
      }}>Retry</Button>
      </div>
			<Text color="gray.500" mt={8}>
				please report it to{" "}
				<ChakraLink
					href="mailto:bhaskar@thevantageproject.com"
					color="teal.500"
				>
					bhaskar@thevantageproject.com
				</ChakraLink>
				, we will reach out to you as soon as possible
			</Text>
		</Box>
    </div>
  );
}

export default ErrorMessage;
