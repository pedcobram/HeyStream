import React from "react";
import ReactPlayer from "react-player/twitch";

import { useParams } from "react-router-dom";

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";


const TwitchVod = () => {

    const {vodId} = useParams();


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
