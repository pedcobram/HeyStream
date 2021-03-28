import React from "react";
import { useQuery, gql } from "@apollo/client"

import capitalize from "../shared/functions/capitalize"

import SubText from "../shared/SubText"
import Text from "../shared/Text"
import Video from "../shared/Video"

const youtubeQuery = gql`
    query($userId: String!, $twitchUserId: String!) {
        getTwitchStream(userId: $userId, twitchUserId: $twitchUserId) {
        id
        user_id
        user_login
        user_name
        game_id
        game_name
        type
        title
        viewer_count
        started_at
        language
        thumbnail_url
        tag_ids
        }
    }
`;

const YoutubeStream = (props)  => {
    /*
    const { loading, data } = useQuery(youtubeQuery, {
        variables: { 
            userId: getCookie("userId"),
            twitchUserId: props.to_id
        },
    })
    */
    if(loading || typeof data === 'undefined' ) return null;

    return (
        <div>
            {data?.getYoutubeStream.map(v => ({...v, platform: 'Twitch'})).filter((video) => {
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
        </div>
    )
};

export default YoutubeStream;