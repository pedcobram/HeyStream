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
            vod_timestamp
            game
            percentaje
            impressions
        }
    }
`;

const twitchInfoQuery = gql`
    query($videoId: String!) {
        getTwitchVideoInfo(videoId: $videoId) {
            user_name
            title  
        }
    }
`;

const TwitchVod = () => {

    const loadingGif = require('../../images/loadingIcon.gif');

    const {vodId, timestamp} = useParams();

    const { data: twData, loading: twLoading } = useQuery(twitchQuery, {
        variables: { 
            userId: getCookie("userId"),
            videoId: vodId
        },
        skip: !getCookie("userId")
    });

    const { data: twVideoInfo } = useQuery(twitchInfoQuery, {
        variables: {
            videoId: vodId
        },
    });

    return (
        <div>
            <CustomNavBar/>
            <div className="center">
                <div id="box" className="textNoClip">
                    <h3 >{twVideoInfo?.getTwitchVideoInfo.user_name} - {twVideoInfo?.getTwitchVideoInfo.title}</h3>
                    <ReactPlayer id="iframe" wrapper="div" width="1280px" height="720px" controls={true} playing={true} url={"https://www.twitch.tv/videos/{vodId}?t={timestamp}".replace('{vodId}', vodId).replace('{timestamp}', timestamp)} align="left"/>
                </div>
                {!getCookie("userId") && !getCookie("youtubeAccessToken") ? 
                    <div id="box" className="clips" width="100%">
                        Please log in and link your YouTube account to view and generate clips from this vod.
                    </div>
                :
                    twLoading ? 
                        <div id="box" className="clips marginClips" width="100%">
                            <p style={{ position: "absolute",
                                top: "30%",
                                left: "95%",
                                transform: "translate(-100%, 50%)" 
                            }} className="loadingClips">Wait while we load some interesting clips</p>
                            <img style={{
                                position: "absolute",
                                top: "25%",
                                left: "84.5%"
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
                    window.location.href = "/twitch/vods/" + twVideoInfo?.getTwitchVideoInfo.user_name
                }}>Return</a>
            </div>
        </div>
    );
}

export default TwitchVod;
