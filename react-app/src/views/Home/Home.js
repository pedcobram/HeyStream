import React from "react";
import gql from "graphql-tag";

import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/react-hooks";
import styled from "styled-components";

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";


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

const query = gql`
    query {
        getTwitchLinkAccount
    }
`;

const Home = () => {

    const [getLinkAccount, {loading, data} ] = useLazyQuery(query);

    if (loading) return <p>Loading ...</p>;

    return (
        <Wrapper>
            <CustomNavBar/> 
            <Label>
                <button onClick={() => getLinkAccount()}>Link Account</button>
            </Label>
        </Wrapper>
    );
}

export default Home;
