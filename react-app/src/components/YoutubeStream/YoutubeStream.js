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
                console.log(video)
                    if(props.searchTerm == '') {
                        return video
                    } else if (video.platform.toLowerCase() == props.searchTerm.toLowerCase() || 
                    video.channelTitle.toLowerCase().includes(props.searchTerm.toLowerCase())) {
                        return video
                    }
                }).map((video, idx) => (
                <Video key={idx}>
                    {video.items.slice(0,1).map((item) => (
                        <div>
                            <div className="container">
                                <a href={"/youtube/stream/{user}".replace('{user}', item.id.videoId)}>
                                    <img src={item.snippet.thumbnails.medium.url} />
                                </a>
                                <div className="bottom-right">
                                    <p className="live">
                                        {capitalize(item.snippet.liveBroadcastContent)}
                                    </p>
                                </div>
                            </div>
                            <Text title={item.snippet.title}>{item.snippet.title}</Text>
                            <SubText>{item.snippet.channelTitle}</SubText>
                        </div>
                    ))}
                </Video>
            ))}
        </div>
    )
};

export default YoutubeStream;