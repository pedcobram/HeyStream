import React from "react";
import { useHistory } from "react-router-dom";
import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";

import MyTwitchStreams from '#root/components/MyTwitchStreams'
import MyYoutubeStreams from '#root/components/MyYoutubeStreams'

import getCookie from "#root/components/shared/functions/getCookie";

const MyStreams = () => {

    if (!getCookie("userId")) useHistory().push("/");

    return (
    <div>
        <CustomNavBar/>
        <MyTwitchStreams/>
        <MyYoutubeStreams/>
    </div>
    );
}

export default MyStreams;