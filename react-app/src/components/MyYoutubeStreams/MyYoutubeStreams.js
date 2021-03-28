import React, { useState } from "react";
import Grid from 'react-css-grid'
import { useHistory } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

import getCookie from "../shared/functions/getCookie"

//import YoutubeStream from "../YoutubeStream"

const youtubeQuery = gql`
query($userId: String!) {
        getFollowedYoutubeUsers(userId: $userId) {
        nextPageToken
        pageInfo {
            totalResults
            resultsPerPage
        }
        items {
            snippet {
            resourceId {
                channelId
            }
            }
        }
        }
    }
`;

const MyYoutubeStreams = ()  => {

    if (!getCookie("userId")) useHistory().push("/");

    const [searchTerm, setSearchTerm] = useState('')
    const [visibleStreams, setVisibleStreams] = useState(20);

    const { loading, error, data } = useQuery(youtubeQuery, {
        variables: { 
            userId: getCookie("userId")
        },
    });

    console.log(data)

    if(loading && !data) return null;

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

    return (
        <div>
            <Grid className="centered">
                {data?.getFollowedYoutubeUsers.items.map((item, idx) => (
                    <div id="white">
                        {item.snippet.resourceId.channelId}
                    </div>
                ))}
            </Grid>
        </div>
    )
};

export default MyYoutubeStreams;