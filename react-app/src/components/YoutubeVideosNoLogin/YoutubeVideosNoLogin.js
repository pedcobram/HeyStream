import React from "react";
import Grid from 'react-css-grid';

import capitalize from "../shared/functions/capitalize";

import SubText from "../shared/SubText";
import Text from "../shared/Text";
import Video from "../shared/Video";

const YoutubeVideosNoLogin = (props)  => {

    return (
        <Grid className="centered">  
            {props.videos?.getYoutubeVideosNoLogin.items.map(v => ({...v, platform: 'YouTube'})).filter((video) => {
                if(props.searchTerm == '') {
                    return video
                } else if (video.platform.toLowerCase() == props.searchTerm.toLowerCase()) {
                    return video
                }
            }).map((video, idx) => (
                <Video key={idx}>
                    <div className="container">
                        <a href={"/youtube/stream/{user}".replace('{user}', video.id.videoId)}>
                            <img src={video.snippet.thumbnails.medium.url} />
                        </a>
                        <div className="bottom-right">
                            <p className="live">
                                {capitalize(video.snippet.liveBroadcastContent)}
                            </p>
                        </div>
                    </div>
                    <Text title={video.snippet.title}>{video.snippet.title}</Text>
                    <SubText>{video.snippet.channelTitle}</SubText>
                </Video>
            ))}
        </Grid>
    )
};

export default YoutubeVideosNoLogin;