import React, { useState } from "react";
import { useQuery, useLazyQuery} from "@apollo/client";
import gql from "graphql-tag";
import ReactPlayer from "react-player/youtube";

import { useParams } from "react-router-dom";

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";
import getCookie from "#root/components/shared/functions/getCookie";

const clipsQuery = gql`
    query($userId: String!, $videoId: String!, $next: Boolean!) {
        getYoutubeClips(userId: $userId, videoId: $videoId, next: $next) {
            data {
              time
              title
              impressions
            }
            next
        }
    }
`;

const videoInfoQuery = gql`
    query($videoId: String!) {
        getYoutubeVideoInfo(videoId: $videoId) {
            id
            snippet {
            title
            description
            channelId
            publishedAt
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

const YoutubeVod = () => {

    const loadingGif = require('../../images/loadingIcon.gif');

    const [reload, setReload] = useState(0);

    const { videoId, timestamp } = useParams();

    if( timestamp ) {
        const a = timestamp.split(':');
        var timestampSeconds = 0;
        if(timestamp.split(':').length == 1) {
            timestampSeconds = (+a[0]); 
        } else if(timestamp.split(':').length == 2) {
            timestampSeconds = (+a[0]) * 60 + (+a[1]); 
        } else {
            timestampSeconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
        }
    }

    const { data: IClips, loading, refetch} = useQuery(clipsQuery, {
        variables: { 
            userId: getCookie("userId"),
            videoId: videoId,
            next: false
        },
        skip: !getCookie("userId")
    });

    const { data: videoInfo} = useQuery(videoInfoQuery, {
        variables: {
            videoId: videoId
        }
    });

    const [getNewClips, { called, loading: loadingClips, refetch: refetchNext }] = useLazyQuery(clipsQuery, {
        variables: {
            userId: getCookie("userId"),
            videoId: videoId,
            next: true
        } 
    });

    if(called && !loadingClips) {
        refetch();
        refetchNext();
    }

    return (
        <div>
            <CustomNavBar/>
            <div className="center">
                <div id="box" className="textNoClip">
                    <h3>{videoInfo?.getYoutubeVideoInfo.snippet.channelTitle} - {videoInfo?.getYoutubeVideoInfo.snippet.title}</h3>
                    <ReactPlayer wrapper="div" width="1280px" height="720px" controls={true} playing={true} url={"https://www.youtube.com/watch?v={videoId}?t={timestamp}".replace('{videoId}', videoId).replace('{timestamp}', timestampSeconds)} align="left"/>
                </div>
                {!getCookie("userId") && !getCookie("youtubeAccessToken") ? 
                    <div id="box" className="clips" width="100%">
                        Please log in and link your YouTube account to view and generate clips from this vod.
                    </div>
                :
                    loading || loadingClips ? 
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
                                <div className="centerButton"> 
                                    {IClips?.getYoutubeClips?.next && !loading ?
                                        <button className="btn btn-dark" onClick={() => getNewClips()} onClickCapture={() => setReload(reload+1)}>Generate clips for the next 2H</button>
                                        :
                                        null
                                    }
                                </div>
                                {IClips?.getYoutubeClips?.data.map((clip, idx) => (
                                    <div key={idx}> 
                                        <div>Title: {clip[0].title}</div>
                                        <div>
                                            Timestamp: 
                                            <a id="box" className="btn btn-dark" href={"/youtube/vod/" + videoId + "/" + clip[0].time}>{clip[0].time}</a>
                                        </div>
                                        <div>Number of impressions: {clip[0].impressions}</div>
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
                    window.location.href = "/youtube/vods/" + videoInfo?.getYoutubeVideoInfo.snippet.channelId
                }}>Return</a>
            </div>       
        </div>
    );
}

export default YoutubeVod;
