import React from "react";
import { useQuery, gql } from "@apollo/client";
import ReactPlayer from "react-player/twitch";

import { useParams } from "react-router-dom";

import getCookie from "#root/components/shared/functions/getCookie";
import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";

const twitchQuery = gql`
    query($userId: String!, $videoId: String!) {
        getTwitchStreamClips(userId: $userId, videoId: $videoId) {
            url
            title
            game
            percentaje
            impressions
        }
    }
`;

const TwitchVod = () => {

    const {vodId} = useParams();

    const { data: twData, loading: twLoading } = useQuery(twitchQuery, {
        variables: { 
            userId: getCookie("userId"),
            videoId: vodId
        },
    });

    console.log(twData)

    //onProgress={playedSeconds => console.log(playedSeconds)}

    return (
        <div>
            <CustomNavBar/>
            <div className="center">
                <div id="box">
                    <ReactPlayer wrapper="div" width="1280px" height="720px" controls={true} playing={true} url={"https://www.twitch.tv/videos/{vodId}".replace('{vodId}', vodId)} align="left"/>
                </div>
            </div>
        </div>
    );
}

export default TwitchVod;
