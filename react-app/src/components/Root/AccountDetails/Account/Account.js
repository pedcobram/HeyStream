import  { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag"
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { clearSession } from "#root/store/ducks/session";

const Email = styled.div`
    color: ${props => props.theme.nero};
    font-size: 1rem;
    margin-top: .25rem;
`;

const LogoutLink = styled.a.attrs({ href: "#"})`
    color: blue;
    display: block;
    margin-top: .25rem;
`;

const Wrapper = styled.div`
    color: ${props => props.theme.mortar};
    font-size: 0.9rem;
`;

const mutation = gql`
    mutation($sessionId: ID!) {
        deleteUserSession(sessionId: $sessionId)
    }
`;

const Account = () => {
    const dispatch = useDispatch();
    const [deleteUserSession] = useMutation(mutation);
    const session = useSelector(state => state.session);

    return (
    <Wrapper>
        Logged in as <Email>{session.user.email}</Email>
        <LogoutLink onClick={evt => {
            evt.preventDefault();
            dispatch(clearSession());
            deleteUserSession({ variables: { sessionId: session.id }});
        }}>(Logout)</LogoutLink>
    </Wrapper>
    );
};

export default Account;