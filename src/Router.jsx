import React from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import App from './App'

export default function Router() {
    return (
        <BrowserRouter>
            <Route path="/">
                <Redirect to="/network-details" />
                <App />
            </Route>
        </BrowserRouter>
    )
}
