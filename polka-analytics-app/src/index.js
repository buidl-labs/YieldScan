import React from "react";
import ReactDOM from "react-dom";
import {
    ThemeProvider,
    ColorModeProvider,
    CSSReset,
    theme
} from "@chakra-ui/core";
import Router from "./Router.jsx";
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

ReactDOM.render(
    <ThemeProvider theme={customTheme}>
        <ColorModeProvider>
            <CSSReset />
            <Router />
        </ColorModeProvider>
    </ThemeProvider>,
    document.getElementById("root")
);
