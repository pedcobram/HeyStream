import  { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag"
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { clearSession } from "#root/store/ducks/session";

const mutation = gql`
    mutation($sessionId: ID!) {
        deleteUserSession(sessionId: $sessionId)
    }
`;

const Account = (props) => {

    const history = useHistory();

    const dispatch = useDispatch();
    const [deleteUserSession, loading, error] = useMutation(mutation, {
        onCompleted({ deleteUserSession }) {
            window.location.reload();
        } 
    });

    if(error) return null

    const session = useSelector(state => state.session);

    return (
        <div>
            <button style={{
                height: "2.5rem"
            }} className="btn btn-secondary" onClick={evt => {
                evt.preventDefault();
                dispatch(clearSession());
                deleteUserSession({ variables: { sessionId: session.id }});
            }}>Logout</button>
        </div>
    );
};

export default Account;