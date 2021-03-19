import React from "react";
import gql from "graphql-tag";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";

import { setTwitchSession } from "#root/store/ducks/twitchSession"

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";
import TextInput from "#root/components/shared/TextInput";

const Wrapper = styled.div`
    color: ${props => props.theme.mortar};
    font-size: 0.9rem;
    width: 100%
`;

const mutation = gql`
    mutation($code: String!, $userId: String!) {
        twitchLanding(code: $code, userId: $userId) 
    }
`;

const LandingTwitch = () => {

    const loadingGif = require('../../images/loadingIcon.gif');

    const dispatch = useDispatch();
    const history = useHistory();

    const session = useSelector(state => state.session);
    const sessionUserId = session?.id
    

    const urlParams = new URLSearchParams(window.location.search);
    const twitchCode = urlParams.get('code');

    const [twitchLanding, {data, error}] = useMutation(mutation);   

    const {
        formState: { isSubmitting },
        handleSubmit,
        register
    } = useForm(); 

    const onSubmit = handleSubmit(async ({ code, userId }) => {   
        await twitchLanding({ 
            variables: { 
               code,
               userId
            } 
        })
        dispatch(setTwitchSession(true));
        history.push("/account");
    })

    setInterval(() => {
        document.getElementById("landing")?.click();
    }, 1000);

    return (
        <div>
            <CustomNavBar/>
            <div  >
                <h2 style={{   position: "fixed",
                            top: "42%",
                            left: "50%",
                            transform: "translate(-50%, -50%)" 
                }}>Wait while we redirect you back</h2>
                <img style={{   position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)" 
                }} src={ loadingGif } width="100" height="100" />  
                <div className="form-row form-row-end">
                        <form onSubmit={onSubmit}>
                            <TextInput  className="form-control mr-sm-2" disabled={false} name="code" type="hidden" defaultValue={twitchCode} ref={register} />
                            <TextInput className="form-control mr-sm-2" disabled={false} name="userId" type="hidden" defaultValue={sessionUserId} ref={register} />
                            <button style={{display:"none"}} className="btn btn-primary my-2 my-sm-0" id="landing" disabled={isSubmitting} type="submit">Continue</button>
                        </form>
                </div>
            </div>
        </div>
    );
}

export default LandingTwitch;
