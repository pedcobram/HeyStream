import React from "react";

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";
import TwitchVideosNoLogin from "#root/components/TwitchVideosNoLogin";
import YoutubeVideosNoLogin from "#root/components/YoutubeVideosNoLogin";

const Home = () => {

    return (
        <div>
            <CustomNavBar/>
            <TwitchVideosNoLogin/>
            <YoutubeVideosNoLogin/>
        </div>
    );
}

export default Home;
