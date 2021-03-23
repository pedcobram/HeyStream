import React from "react";

import capitalize from "../shared/functions/capitalize"

import SubText from "../shared/SubText"
import Text from "../shared/Text"
import Video from "../shared/Video"
import Container from "../shared/Container"

const YoutubeVideosNoLogin = (props)  => {

    return (
        <div>
            <Container>
                {props.videos?.getYoutubeVideosNoLogin.items.map(v => ({...v, platform: 'YouTube'})).filter((video) => {
                    console.log(props.searchTerm)
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
            </Container>
        </div>

    )
};

export default YoutubeVideosNoLogin;