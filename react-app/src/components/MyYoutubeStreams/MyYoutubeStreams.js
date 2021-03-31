import React from "react";
import Grid from 'react-css-grid'
import { useHistory } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import styled from "styled-components";

import getCookie from "../shared/functions/getCookie"

import YoutubeStream from "../YoutubeStream"

const PlatformText = styled.h3`
    color: var(--silver);
    margin-top: 1rem;
    padding-left: 2.5rem;
`;

const youtubeQuery = gql`
    query($userId: String!) {
        getYoutubeStreams(userId: $userId) {
            response {
                publishedAt
                channelId
                title
                description
                thumbnails {
                    medium {
                    url
                    width
                    height
                    }
                }
                channelTitle
                liveBroadcastContent
                }
            }
    }
`;

const MyYoutubeStreams = (props)  => {

    if (!getCookie("userId")) useHistory().push("/");

    const loadingGif = require('../../images/loadingIcon.gif');

    const { data, loading } = useQuery(youtubeQuery, {
        variables: { 
            userId: getCookie("userId")
        }
    });

    console.log(data?.getYoutubeStreams.response[0].channelTitle)

    return (
        <Grid className="centered">
            {data?.getYoutubeStreams.response.length == 0 ? 
                <PlatformText>There are no YouTube streamers live that you follow</PlatformText>
            :
                data?.getYoutubeStreams.response.map((item, idx) => (
                    <YoutubeStream key={idx} videos={item} searchTerm={props.searchTerm} />
                ))
            }
        </Grid>
    )
};

export default MyYoutubeStreams;