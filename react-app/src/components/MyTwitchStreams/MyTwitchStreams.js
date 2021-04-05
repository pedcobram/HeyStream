import React from "react";
import Grid from 'react-css-grid'
import { useHistory } from "react-router-dom";

import getCookie from "#root/components/shared/functions/getCookie"
import capitalize from "#root/components/shared/functions/capitalize"
import kFormatter from "#root/components/shared/functions/kFormatter"

import SubText from "#root/components/shared/SubText"
import Text from "#root/components/shared/Text"
import Video from "#root/components/shared/Video"
import PlatformText from "#root/components/shared/PlatformText";

const MyTwitchStreams = (props)  => {

    if (!getCookie("userId")) useHistory().push("/");

    console.log(props.videos)

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
                <PlatformText className="centerImage">There are no Twitch streamers live that you follow</PlatformText>
            </div>
        );
    }

    return (
        <div>
            <Grid className="centered">  
                {props.videos.map(v => ({...v, platform: 'Twitch'})).filter((video) => {
                        if(props.searchTerm == '') {
                            return video
                        } else if (video.platform.toLowerCase() == props.searchTerm.toLowerCase() ||
                        video.game_name.toLowerCase().includes(props.searchTerm.toLowerCase()) ||
                        video.user_name.toLowerCase().includes(props.searchTerm.toLowerCase())) {
                            return video
                        }
                    }).slice(0, props.visibleStreams).map((data, idx) => (
                    <Video key={idx}>
                        <div className="container">
                            <a href={"/twitch/stream/{user}".replace('{user}', data?.user_name)}>
                                <img src={data?.thumbnail_url.replace('{width}', 320).replace('{height}', 180)} />
                            </a>
                            <div className="bottom-right">
                                <p className="live">
                                    {capitalize(data?.type)}
                                </p>
                            </div>
                            <div className="bottom-left">
                                <div className="viewers">
                                    {kFormatter(data?.viewer_count)} viewers
                                </div>
                            </div>
                        </div>
                        <Text title={data?.title}>{data?.title}</Text>
                        <SubText>{data?.user_name}</SubText>
                        <SubText>{data?.game_name}</SubText>
                    </Video>
                ))}   
            </Grid>
        </div>
    )
};

export default MyTwitchStreams;