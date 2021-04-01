import React from "react";
import Grid from 'react-css-grid';

import capitalize from "#root/components/shared/functions/capitalize";
import kFormatter from "#root/components/shared/functions/kFormatter";

import SubText from "../shared/SubText";
import Text from "../shared/Text";
import Video from "../shared/Video";

const TwitchVideosNoLogin = (props)  => {

    return (
        <Grid className="centered">  
            {props.videos?.getTwitchVideosNoLogin.map(v => ({...v, platform: 'Twitch'})).filter((video) => {
                if(props.searchTerm == '') {
                    return video
                } else if (video.platform.toLowerCase() == props.searchTerm.toLowerCase()) {
                    return video
                }
            }).map((video, idx) => (
                <Video key={idx}>
                    <div className="container">
                        <a href={"/twitch/stream/{user}".replace('{user}', video.user_name)}>
                            <img src={video.thumbnail_url.replace('{width}', 320).replace('{height}', 180)} />
                        </a>
                        <div className="bottom-right">
                            <p className="live">
                                {capitalize(video.type)}
                            </p>
                        </div>
                        <div className="bottom-left">
                            <div className="viewers">
                                {kFormatter(video.viewer_count)} viewers
                            </div>
                        </div>
                    </div>
                    <Text title={video.title}>{video.title}</Text>
                    <SubText>{video.user_name}</SubText>
                    <SubText>{video.game_name}</SubText>
                </Video>
            ))}
        </Grid>
    )
};

export default TwitchVideosNoLogin;