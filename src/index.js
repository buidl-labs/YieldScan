import React from "react";
import ReactDOM from "react-dom";
import {
    ThemeProvider,
    ColorModeProvider,
    CSSReset,
    theme
} from "@chakra-ui/core";
import App from "./App.jsx";
import "./stylesheets/scss/index.scss"

const customTheme = {
    ...theme,
    colors: {
        ...theme.colors,
        brand: {
            900: "#E50B7B"
        }
    }
};

ReactDOM.hydrate(
    <ThemeProvider theme={customTheme}>
        <ColorModeProvider>
            <CSSReset />
            <App />
        </ColorModeProvider>
    </ThemeProvider>,
    document.getElementById("root")
);
