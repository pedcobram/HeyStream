import React from "react";

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";
import TwitchVideosNoLogin from "#root/components/TwitchVideosNoLogin/TwitchVideosNoLogin";

const Home = () => {

    return (
        <div>
            <CustomNavBar/>
            <TwitchVideosNoLogin/>
        </div>
    );
}

export default Home;
