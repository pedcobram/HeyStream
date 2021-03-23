import React from "react";
import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";

import MyTwitchStreams from '#root/components/MyTwitchStreams'

const MyStreams = () => {

    return (
    <div>
        <CustomNavBar/>
        <MyTwitchStreams/>
    </div>
    );
}

export default MyStreams;