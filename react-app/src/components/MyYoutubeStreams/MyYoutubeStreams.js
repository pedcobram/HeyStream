import React from "react";
import Grid from 'react-css-grid';
import { useHistory } from "react-router-dom";

import getCookie from "#root/components/shared/functions/getCookie";
import PlatformText from "#root/components/shared/PlatformText";

import YoutubeStream from "#root/components/YoutubeStream";

const MyYoutubeStreams = (props)  => {

    if (!getCookie("userId")) useHistory().push("/");

    if(props.loading && !props.videos) {
        const loadingGif = require('../../images/loadingIcon.gif');
        return (
            <div className="wrapperImage">
                <img className="centerImage" src={loadingGif} height="75px" width="75px"/>
            </div>
        );
    };

    if(!props.videos) {
        return (
            <div className="wrapperImage">
                <PlatformText className="centerImage">There are no YouTube streamers live that you follow</PlatformText>
            </div>
        );
    }

    return (
        <Grid className="centered">
            {props.videos?.getYoutubeStreams.response.slice(0, props.visibleStreams).map((item, idx) => (
                <YoutubeStream key={idx} videos={item} searchTerm={props.searchTerm} visibleStreams={props.visibleStreams} />
            ))}
        </Grid>
    )
};

export default MyYoutubeStreams;