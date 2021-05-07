import React, { useState } from "react";
import { useQuery, useLazyQuery, gql } from "@apollo/client";
import ReactPlayer from "react-player/youtube";
import { useHistory } from "react-router-dom";

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

const YoutubeVod = () => {

    const loadingGif = require('../../images/loadingIcon.gif');
    let history = useHistory();

    const [reload, setReload] = useState(0);

    const { videoId, timestamp } = useParams();

    if( timestamp ) {
        var a = timestamp.split(':');
        var timestampSeconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
    }

    const { data: IClips, loading, error, refetch, fetching} = useQuery(clipsQuery, {
        variables: { 
            userId: getCookie("userId"),
            videoId: videoId,
            next: false
        },
        errorPolicy: "all"
    });

    const [getNewClips, { called, loading: loadingClips, data, refetch: refetchNext }] = useLazyQuery(clipsQuery, {
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
                <div id="box">
                    <h2>Title</h2>
                    <ReactPlayer wrapper="div" width="1280px" height="720px" controls={true} playing={true} url={"https://www.youtube.com/watch?v={videoId}?t={timestamp}".replace('{videoId}', videoId).replace('{timestamp}', timestampSeconds)} align="left"/>
                </div>
                {loading || loadingClips || called? 
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
                            {IClips.getYoutubeClips?.next && !loading ?
                                <button onClick={() => getNewClips()}>Generate clips for the next 2H</button>
                                :
                                null
                            }
                            {IClips.getYoutubeClips?.data.map((clip, idx) => (
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
                    history.goBack();
                }}>Return</a>
            </div>
        </div>
    );
}

export default YoutubeVod;
