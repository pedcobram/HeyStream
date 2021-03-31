import React from "react";
import Grid from 'react-css-grid'
import { useHistory } from "react-router-dom";

import getCookie from "../shared/functions/getCookie"
import capitalize from "../shared/functions/capitalize"
import kFormatter from "../shared/functions/kFormatter"

import SubText from "../shared/SubText"
import Text from "../shared/Text"
import Video from "../shared/Video"

const MyTwitchStreams = (props)  => {

    if (!getCookie("userId")) useHistory().push("/");

    if(props.loading && !props.videos) return null;

    return (
        <Grid autoFlow='column'>  
            {props.videos.map(v => ({...v, platform: 'Twitch'})).slice(0, props.visibleStreams).filter((video) => {
                    if(props.searchTerm == '') {
                        return video
                    } else if (video.platform.toLowerCase() == props.searchTerm.toLowerCase()) {
                        return video
                    }
                }).map((data, idx) => (
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
    )
};

export default MyTwitchStreams;