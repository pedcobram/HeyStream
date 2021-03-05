import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import TextInput from "#root/components/shared/TextInput";
import { useDispatch, useSelector} from "react-redux";
import { setSession } from "#root/store/ducks/session";

import Alert from "react-bootstrap/Alert"

import "bootstrap/dist/css/bootstrap.min.css";

const Label = styled.label`
    display: block;
`;

const LabelText = styled.strong`
    display: block;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
`;

const LoginButton = styled.button`
    display: inline-block;
    margin-top: 0.5rem;;
`;

const OrSignUp = styled.span`
    font-size: 0.9rem;
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
    const [createUserSession] = useMutation(mutation)

    const {
        formState: { isSubmitting },
        handleSubmit,
        register,
        errors
    } = useForm(); 

    const onSubmit = handleSubmit(async ({ email, password }) => {
        const {
            data: { createUserSession: createdSession }
        } = await createUserSession({ 
            variables: { 
                email, 
                password 
            } 
        });
        dispatch(setSession(createdSession));
    })

    const style = {
        width: "15rem"
    }

    return (
        <div style={style}> 
            <form className="" onSubmit = { onSubmit }>
                <Label>
                    <LabelText className="input-group-text">Email</LabelText>
                    <TextInput className="form-control mr-sm-2" disabled={isSubmitting} name="email" type="email" ref={register} />
                </Label>
                <Label>
                    <LabelText className="input-group-text" >Password</LabelText>
                    <TextInput className="form-control mr-sm-2" disabled={isSubmitting} name="password" type="password" ref={register} />
                </Label>
                <LoginButton className="btn btn-primary my-2 my-sm-0" disabled={isSubmitting} type="submit">Login</LoginButton>
                {" "}
                <OrSignUp>
                    or{" "}
                    <a className="btn btn-secondary"
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