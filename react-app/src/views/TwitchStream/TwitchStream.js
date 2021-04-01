import React from "react";
import ReactPlayer from "react-player/twitch";

import { useParams } from "react-router-dom";

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";

const TwitchStream = () => {

    const {user} = useParams();

    return (
        <div>
            <CustomNavBar/>
            <div className="center">
                <div id="box">
                    <ReactPlayer wrapper="div" width="1280px" height="720px" playing="true" url={"https://www.twitch.tv/{user}".replace('{user}', user)} align="left"/>
                </div>
                <div id="box">
                    <iframe src={"https://www.twitch.tv/embed/{user}/chat?parent=localhost&darkpopout".replace("{user}", user)} height="720px" width="120%" align="right" />
                </div>
            </div>
        </div>
    );
}

export default TwitchStream;
