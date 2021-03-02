import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import { ApolloProvider as ApolloHooksProvider } from "@apollo/react-hooks";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createGlobalStyle, ThemeProvider } from "styled-components"

import graphqlClient from "#root/api/graphql/graphqlClient"
import Root from "#root/components/Root"
import store from "./store"

import * as theme from "./theme"

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

    html, body, #app {
        height: 100%;
        margin: 0;
        padding: 0;
        width: 100%
    }

    body {
        font-family: Roboto, sans-serif;
    }
`;

render(
    <Provider store={store}>
        <ApolloHooksProvider client={graphqlClient}>
            <ThemeProvider theme={theme}>
                <GlobalStyle /> 
                <Root /> 
            </ThemeProvider>
        </ApolloHooksProvider>
    </Provider>, 
    document.getElementById("app")
);