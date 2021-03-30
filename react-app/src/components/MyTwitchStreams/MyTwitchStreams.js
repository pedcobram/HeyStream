import React, { useState } from "react";
import Grid from 'react-css-grid'
import { useHistory } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

import getCookie from "../shared/functions/getCookie"

import TwitchStream from "../TwitchStream"

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

const MyTwitchStreams = (props)  => {

    if (!getCookie("userId")) useHistory().push("/");

    const [visibleStreams, setVisibleStreams] = useState(20);

    const { loading, data } = useQuery(twitchQuery, {
        variables: { 
            userId: getCookie("userId")
        },
    });

    if(loading && !data) return null;
  
    var dataLen = data?.getFollowedTwitchUsers.data.length;

    const clickSeeMore = () => {
        setVisibleStreams(dataLen);
    }

    const clickSeeLess = () => {
        setVisibleStreams(20);
    }

    return (
        <div>
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
            <Grid className="centered">
                {data?.getFollowedTwitchUsers.data.slice(0, visibleStreams).map((item, idx) => (
                    <TwitchStream  key={idx} to_id={item.to_id} to_login={item.to_login} to_name={item.to_name} searchTerm={props.searchTerm}></TwitchStream>
                ))}
            </Grid>
        </div>
    )
};

export default MyTwitchStreams;