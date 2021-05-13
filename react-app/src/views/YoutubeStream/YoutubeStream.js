import React from "react";
import { useQuery, gql } from "@apollo/client";
import ReactPlayer from "react-player/youtube";

import { useParams } from "react-router-dom";

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";
import getCookie from "#root/components/shared/functions/getCookie";

const query = gql`
    query($videoId: String!) {
        getYoutubeChannelId(videoId: $videoId) {
            channelId
        }
    }
`;

const YoutubeStream = () => {
    
    const {videoId} = useParams();

    const { data, loading, error } = useQuery(query, {
        variables: { 
            userId: getCookie("userId"),
            videoId: videoId
        }
    }); 

    return (
        <div>
            <CustomNavBar/>
            <div className="center">
                <div id="box">
                    <ReactPlayer wrapper="div" width="1280px" height="720px" playing={true} controls={true} url={"https://www.youtube.com/watch?v={videoId}".replace('{videoId}', videoId)} align="left"/>
                </div>
                <div id="box">
                    <iframe src={"https://www.youtube.com/live_chat?v={videoId}&embed_domain=localhost".replace('{videoId}', videoId)} width="120%" height="720px"></iframe> 
                </div>
            </div>
            <div className="center">
                <a id="box" className="btn btn-dark" href={"/youtube/vods/" + data?.getYoutubeChannelId.channelId}>Go to VoDs</a>
            </div>
        </div>
    );
}

export default YoutubeStream;
