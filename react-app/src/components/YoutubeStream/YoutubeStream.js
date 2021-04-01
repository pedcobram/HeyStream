import React from "react";

import capitalize from "../shared/functions/capitalize";

import SubText from "../shared/SubText";
import Text from "../shared/Text";
import Video from "../shared/Video";

const YoutubeStream = (props)  => {

    var array = []
    array.push(props.videos)

    return (
        <div>
            {array.map(v => ({...v, platform: 'YouTube'})).filter((video) => {
                    if(props.searchTerm == '') {
                        return video
                    } else if (video.platform.toLowerCase() == props.searchTerm.toLowerCase() || 
                    video.channelTitle.toLowerCase().includes(props.searchTerm.toLowerCase())) {
                        return video
                    }
                }).map((video, idx) => (
                <Video key={idx}>
                    <div className="container">
                        <a href={"/youtube/stream/{user}".replace('{user}', video.channelId)}>
                            <img src={video.thumbnails.medium.url} />
                        </a>
                        <div className="bottom-right">
                            <p className="live">
                                {capitalize(video.liveBroadcastContent)}
                            </p>
                        </div>
                    </div>
                    <Text title={video.title}>{video.title}</Text>
                    <SubText>{video.channelTitle}</SubText>
                </Video>
            ))}
        </div>
    )
};

export default YoutubeStream;