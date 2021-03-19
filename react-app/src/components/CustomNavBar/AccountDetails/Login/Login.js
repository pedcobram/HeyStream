import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import TextInput from "#root/components/shared/TextInput";
import { useDispatch } from "react-redux";
import { setSession } from "#root/store/ducks/session";

import { MDBAlert } from 'mdbreact';

import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/style.css"

const Label = styled.label`
    display: block;
`;

const LabelText = styled.strong`
    display: block;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
    border: none;
`;

const LoginButton = styled.button`
    display: inline-block;
    margin-top: 0.5rem;;
`;

const OrSignUp = styled.span`
    font-size: 0.9rem;
    color: rgb(189,189,189);
`;

const mutation = gql`
    mutation($email: String!, $password: String!) {
        createUserSession(email: $email, password: $password) {
            id
            user {
                email
                id
            }
        }
    }
`;

const Login = ({ onChangeToSignUp: pushChangeToSignUp}) => {
    const dispatch = useDispatch();
    const [createUserSession, {data, error}] = useMutation(mutation)
    
    const {
        formState: { isSubmitting },
        handleSubmit,
        register
    } = useForm(); 

    const onSubmit = handleSubmit(async ({ email, password }) => {   
        const {
            data: { createUserSession: createdSession }
        } = await createUserSession({ 
            variables: { 
                email, 
                password 
            } 
        })
        dispatch(setSession(createdSession));
    })

    const style = {
        width: "20rem"
    }

    return (
        <div style={style}> 
            <form id="loginForm" onSubmit = { onSubmit }>
                <Label>
                    {error?
                        <MDBAlert dismiss color="warning">
                            {error?.message.replace("GraphQL error: ", "")}
                        </MDBAlert>
                    :null}
                </Label>
                <Label>
                    <LabelText id="labelText" className="input-group-text">Email</LabelText>
                    <TextInput  className="form-control mr-sm-2" disabled={isSubmitting} name="email" type="text" ref={register} />
                </Label>
                <Label>
                    <LabelText id="labelText" className="input-group-text" >Password</LabelText>
                    <TextInput className="form-control mr-sm-2" disabled={isSubmitting} name="password" type="password" ref={register} />
                </Label>
                <LoginButton id="loginButton"  className="btn btn-primary my-2 my-sm-0" disabled={isSubmitting} type="submit" >Login</LoginButton>
                {" "}
                <OrSignUp id="orSignUpButton">
                    or{" "}
                    <a id="signupButton" className="btn btn-secondary"
                        href="#" onClick={evt => {
                            evt.preventDefault();
                            pushChangeToSignUp();
                        }}>
                        Sign Up
                    </a>
                </OrSignUp>
            </form>
        </div>
    ); 
};

export default Login;