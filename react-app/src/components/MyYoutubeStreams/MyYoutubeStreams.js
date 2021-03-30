import React, { useState } from "react";
import Grid from 'react-css-grid'
import { useHistory } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import styled from "styled-components";

import getCookie from "../shared/functions/getCookie"

import YoutubeStream from "../YoutubeStream"
import { printIntrospectionSchema } from "graphql";

const PlatformText = styled.h3`
    color: var(--silver);
    margin-top: 1rem;
    padding-left: 2.5rem;
`;

const youtubeQuery = gql`
    query($userId: String!, $pageToken: String) {
        getYoutubeStreams(userId: $userId, pageToken: $pageToken) {
            data {
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
            },
            nextPageToken
        }
        }
`;

const MyYoutubeStreams = (props)  => {

    if (!getCookie("userId")) useHistory().push("/");

    const [pageToken, setPageToken] = useState("");
    var youtubeData = [];
    var token = "";

    const { data, loading } = useQuery(youtubeQuery, {
        variables: { 
            userId: getCookie("userId"),
            pageToken: ""
        }
    });

    if (loading) return null;
    if (!loading && data) token = data?.getYoutubeStreams.nextPageToken

    const clickSeeMore = () => {
        setPageToken(token);
    }

    console.log(pageToken)

    return (
        <div>
            <button className="btn btn-dark" type="button" onClick={clickSeeMore}>
                See more YouTube Streams
            </button>
            <Grid className="centered">
                {data?.getYoutubeStreams.data.length == 0 ? 
                    <PlatformText>There are no YouTube streamers live that you follow</PlatformText>
                    : 
                    youtubeData?.getYoutubeStreams.data.map((item, idx) => (
                        <YoutubeStream key={idx} videos={item} searchTerm={props.searchTerm} />
                    ))
                }
            </Grid>
        </div>
    )
};

export default MyYoutubeStreams;