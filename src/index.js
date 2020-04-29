import React from 'react'
import ReactDOM from 'react-dom'
import {
    ThemeProvider,
    ColorModeProvider,
    CSSReset,
    theme,
} from '@chakra-ui/core'
import App from './App.jsx'
import './stylesheets/scss/index.scss'
import ErrorBoundary from './components/ErrorBoundary'

import * as Sentry from '@sentry/browser'
Sentry.init({
    dsn: 'https://f3d041ae0c9845be88aa6f208ac095c3@sentry.io/1882544',
})

const customTheme = {
    ...theme,
    colors: {
        ...theme.colors,
        brand: {
            900: '#E50B7B',
        },
    },
}

ReactDOM.hydrate(
    <ThemeProvider theme={customTheme}>
        <ColorModeProvider>
            <CSSReset />
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </ColorModeProvider>
    </ThemeProvider>,
    document.getElementById('root')
)
