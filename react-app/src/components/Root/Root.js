import gql from 'graphql-tag';
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import graphqlClient from "#root/api/graphql/graphqlClient";
import { setSession, getSession } from "#root/store/ducks/session";

import AccountDetails from "./AccountDetails";

const Container = styled.div`
    display: flex;
    flex-flow: row nowrap;
    margin: 0 auto;
    width: 80rem;
`;

const Content = styled.div`
    flex: 1;
    margin-right: 1rem;
`;

const Sidebar = styled.div`
    flex: 0 auto;
    width: 10rem;
`;

const Wrapper = styled.div`
    box-sizing: border-box;
    height: 100%;
    padding: 1rem;
    width: 100%;
`;

const query = gql`
    {
        userSession(me: true) {
            id
            user {
                email
                id
            }
        }
    }
`;

const Root = () => {
    const dispatch = useDispatch();
    const [initialised, setInitialised] = useState(false);

    useEffect(() => {
        graphqlClient.query({ query }).then(({ data }) => {
            if(data.userSession) {
                dispatch(setSession(data.userSession));
            }
            setInitialised(true);
        })
    }, []);

    if(!initialised) return "Loading...";
    
    return (
    <Wrapper>       
        <Container>
                <NavBar />
                <Content>
                    Hola :)
                </Content>
                <Sidebar>
                    <AccountDetails />
                </Sidebar>
        </Container>
    </Wrapper>
    )
};

export default Root;