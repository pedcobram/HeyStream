import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";

import MyTwitchStreams from '#root/components/MyTwitchStreams'
import MyYoutubeStreams from '#root/components/MyYoutubeStreams'

import getCookie from "#root/components/shared/functions/getCookie";

const Filters = styled.div`
    display: flex;
    justify-content: left;
    width: 100%;
    padding-left: 4rem;
`;

const Filter = styled.div`
    padding-right: 1rem;
`;

const FilterText = styled.h3`
    color: var(--silver);
    padding-right: 1rem;
`;

const PlatformText = styled.h3`
    color: var(--silver);
    margin-top: 1rem;
    padding-left: 2.5rem;
`;

const MyStreams = () => {

    const [searchTerm, setSearchTerm] = useState('')

    function updateState(searchTerm, param) {
        if(searchTerm == param) {
            setSearchTerm('')
        } else {
            setSearchTerm(param)
        }
    }

    return (
    <div>
        <CustomNavBar/>
        <Filters>
            <FilterText>Filters: </FilterText>
            <Filter>
                <button className="btn btn-primary" onClick={() => {
                    updateState(searchTerm, 'Twitch')
                }}>Twitch</button>
            </Filter>
            <Filter>
                <button className="btn btn-primary" onClick={() => {
                    updateState(searchTerm, 'YouTube')
                }}>YouTube</button>
            </Filter>
        </Filters>
        <PlatformText>Twitch Streams: </PlatformText>
        <MyTwitchStreams searchTerm={searchTerm}/>
        <PlatformText>Youtube Streams: </PlatformText>
        <MyYoutubeStreams searchTerm={searchTerm}/>
    </div>
    );
}

export default MyStreams;