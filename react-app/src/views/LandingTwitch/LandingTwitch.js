import React from "react";
import gql from "graphql-tag";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";
import TextInput from "#root/components/shared/TextInput";


const Label = styled.label`
  display: block;
  :not(:first-child) {
    margin-top: 0.75rem;
  }
`;

const Wrapper = styled.div`
    color: ${props => props.theme.mortar};
    font-size: 0.9rem;
`;

const mutation = gql`
    mutation($code: String!, $userId: String!) {
        twitchLanding(code: $code, userId: $userId) 
    }
`;

const LandingTwitch = () => {

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
        history.push("/");
    })

    setInterval(() => {
        document.getElementById("landing")?.click();
    }, 200);

    return (
        <Wrapper>
            <CustomNavBar/>
            <div>
                Landing Twitch :)
            </div>
            <div className="form-row form-row-end">
                <form onSubmit={onSubmit}>
                    Twitch Code:
                    <TextInput className="form-control mr-sm-2" disabled={false} name="code" type="code" defaultValue={twitchCode} ref={register} />
                    UserId:
                    <TextInput className="form-control mr-sm-2" disabled={false} name="userId" type="userId" defaultValue={sessionUserId} ref={register} />
                    <button  className="btn btn-primary my-2 my-sm-0" id="landing" disabled={isSubmitting} type="submit">Continue</button>
                </form>
            </div>
        </Wrapper>
    );
}

export default LandingTwitch;
