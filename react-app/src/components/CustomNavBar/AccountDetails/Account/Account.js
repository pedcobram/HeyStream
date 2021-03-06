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

const LogoutButton = styled.button.attrs({ href: "#"})`
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
            <LogoutButton className="btn btn-primary my-2 my-sm-0" onClick={evt => {
                evt.preventDefault();
                dispatch(clearSession());
                deleteUserSession({ variables: { sessionId: session.id }});
            }}>Logout</LogoutButton>
        </Wrapper>
    );
};

export default Account;