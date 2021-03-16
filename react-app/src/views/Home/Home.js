import React from "react";
import styled from "styled-components";

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";
import TwitchVideosNoLogin from "#root/components/TwitchVideosNoLogin/TwitchVideosNoLogin";


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

const Home = () => {

    return (
        <Wrapper>
            <CustomNavBar/>
            <TwitchVideosNoLogin/>
        </Wrapper>
    );
}

export default Home;
