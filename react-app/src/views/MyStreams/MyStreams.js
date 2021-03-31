import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useQuery, gql } from "@apollo/client";

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";

import MyTwitchStreams from '#root/components/MyTwitchStreams'
import MyYoutubeStreams from '#root/components/MyYoutubeStreams'

import getCookie from "#root/components/shared/functions/getCookie";

const twitchQuery = gql`
    query($userId: String!) {
        getTwitchStreams(userId: $userId) {
            id
            user_id
            user_login
            user_name
            game_id
            game_name
            type
            title
            viewer_count
            started_at
            language
            thumbnail_url
            tag_ids
        }
    }
`;

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

    const [searchTerm, setSearchTerm] = useState('');
    const [visibleStreams, setVisibleStreams] = useState(10);

    const { data, loading } = useQuery(twitchQuery, {
        variables: { 
            userId: getCookie("userId")
        },
    });

    function updateState(searchTerm, param) {
        if(searchTerm == param) {
            setSearchTerm('');
        } else {
            setSearchTerm(param);
        }
    }

    const clickSeeMore = () => {
        setVisibleStreams(dataLen);
    }

    const clickSeeLess = () => {
        setVisibleStreams(10);
    }

    var dataLen = data?.getTwitchStreams.length;

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
        <div className="right">
            {visibleStreams == dataLen ?
                <button className="btn btn-dark" type="button" onClick={clickSeeLess}>
                    See less Twitch Streams
                </button>
            :
                <button className="btn btn-dark" type="button" onClick={clickSeeMore}> 
                    See more Twitch Streams
                </button>
            }
        </div>
        <PlatformText>Twitch Streams: </PlatformText>
        <MyTwitchStreams searchTerm={searchTerm} visibleStreams={visibleStreams} videos={data?.getTwitchStreams} loading={loading}/>
        <PlatformText>Youtube Streams: </PlatformText>
        <MyYoutubeStreams searchTerm={searchTerm}/>
    </div>
    );
}

export default MyStreams;