import React from "react";
import ReactPlayer from "react-player/youtube";

import { useParams } from "react-router-dom";

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";

const YoutubeVod = () => {

    const { videoId } = useParams();


    return (
        <div>
            <CustomNavBar/>
            <div className="center">
                <div id="box">
                    <ReactPlayer wrapper="div" width="1280px" height="720px" controls={true} playing={true} url={"https://www.youtube.com/watch?v={videoId}".replace('{videoId}', videoId)} align="left"/>
                </div>
            </div>
        </div>
    );
}

export default YoutubeVod;
