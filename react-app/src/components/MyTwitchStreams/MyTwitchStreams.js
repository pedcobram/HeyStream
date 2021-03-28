import React, { useState, useEffect } from "react";
import Grid from 'react-css-grid'
import { useHistory } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import styled from "styled-components";

import getCookie from "../shared/functions/getCookie"

import TwitchStream from "../TwitchStream"
import Container from "../shared/Container"

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

const twitchQuery = gql`
    query($userId: String!) {
        getFollowedTwitchUsers(userId: $userId) {
        total
        data {
            to_id
            to_login
            to_name
        }
        }
    }
`;

const MyTwitchStreams = ()  => {

    if (!getCookie("userId")) useHistory().push("/");

    const [searchTerm, setSearchTerm] = useState('')
    const [visibleStreams, setVisibleStreams] = useState(20);

    const { loading, error, data } = useQuery(twitchQuery, {
        variables: { 
            userId: getCookie("userId")
        },
    });

    if(loading && !data) return null;
  
    var dataLen = data?.getFollowedTwitchUsers.data.length;

    function updateState(searchTerm, param) {
        if(searchTerm == param) {
            setSearchTerm('')
        } else {
            setSearchTerm(param)
        }
    }

    const clickSeeMore = () => {
        setVisibleStreams(dataLen);
    }

    const clickSeeLess = () => {
        setVisibleStreams(20);
    }

    console.log(visibleStreams)

    return (
        <div>
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
            </Filters>
            <Grid className="centered">
                {data?.getFollowedTwitchUsers.data.slice(0, visibleStreams).map((item, idx) => (
                    <TwitchStream  key={idx} to_id={item.to_id} to_login={item.to_login} to_name={item.to_name} searchTerm={searchTerm}></TwitchStream>
                ))}
            </Grid>
        </div>
    )
};

export default MyTwitchStreams;