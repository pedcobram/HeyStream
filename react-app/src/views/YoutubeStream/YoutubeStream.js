import React from "react";
import ReactPlayer from "react-player/youtube"

import { useParams } from "react-router-dom"

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";



const YoutubeStream = () => {

    const {videoId} = useParams();

    return (
        <div>
            <CustomNavBar/>
            <div className="center">
                <div id="box">
                    <ReactPlayer wrapper="div" width="1280px" height="720px" playing="1" controls={true} url={"https://www.youtube.com/watch?v={videoId}".replace('{videoId}', videoId)} align="left"/>
                </div>
                <div id="box">
                    <iframe src={"https://www.youtube.com/live_chat?v={videoId}&embed_domain=localhost".replace('{videoId}', videoId)} width="120%" height="720px"></iframe> 
                </div>
            </div>
        </div>
    );
}

export default YoutubeStream;
