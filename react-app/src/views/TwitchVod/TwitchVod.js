import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import ReactPlayer from "react-player/twitch";
import { useHistory } from "react-router-dom";

import { useParams } from "react-router-dom";

import getCookie from "#root/components/shared/functions/getCookie";
import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";

const twitchQuery = gql`
    query($userId: String!, $videoId: String!) {
        getTwitchStreamClips(userId: $userId, videoId: $videoId) {
            url
            title
            vod_timestamp
            game
            percentaje
            impressions
        }
    }
`;

const TwitchVod = () => {

    const loadingGif = require('../../images/loadingIcon.gif');

    let history = useHistory();
    const {vodId, timestamp} = useParams();

    const { data: twData, loading: twLoading } = useQuery(twitchQuery, {
        variables: { 
            userId: getCookie("userId"),
            videoId: vodId
        },
    });

    return (
        <div>
            <CustomNavBar/>
            <div className="center">
                <div id="box">
                    <h2>Title</h2>
                    <ReactPlayer id="iframe" wrapper="div" width="1280px" height="720px" controls={true} playing={true} url={"https://www.twitch.tv/videos/{vodId}?t={timestamp}".replace('{vodId}', vodId).replace('{timestamp}', timestamp)} align="left"/>
                </div>
                {twLoading ? 
                    <div id="box" className="clips marginClips" width="100%">
                        <p style={{ position: "absolute",
                            top: "25%",
                            left: "45%",
                            transform: "translate(-50%, 50%)" 
                        }} className="loadingClips">Wait while we load some interesting clips</p>
                        <img style={{
                            position: "absolute",
                            top: "20%",
                            left: "32.5%"
                        }} className="loadingClips" src={ loadingGif } width="100" height="100" />
                    </div>
                :
                <div id="box" className="clipContainer">
                    <h2>Selected Clips</h2>
                    <div className="clips">
                        {twData?.getTwitchStreamClips.map((clip, idx) => (
                            <div key={idx}> 
                                <div>Title: {clip.title}</div>
                                <div>
                                    Timestamp: 
                                    <a id="box" className="btn btn-dark" href={"/twitch/vod/" + vodId + "/" + clip.vod_timestamp}>{clip.vod_timestamp}</a>
                                </div>
                                <div>Game: {clip.game}</div>
                                <div>Number of impressions: {clip.impressions}</div>
                                <div>
                                    <a className="btn btn-dark" href={clip.url} target="_blank">Watch on Twitch</a>
                                </div>
                                <br/>
                            </div>
                        ))} 
                    </div>
                </div>
                }                       
            </div>
            <br/>
            <div className="center">
                <a id="box" className="btn btn-dark" onClick={() => {
                    history.goBack();
                }}>Return</a>
            </div>
        </div>
    );
}

export default TwitchVod;
