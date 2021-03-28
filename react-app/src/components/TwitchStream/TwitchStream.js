import React from "react";
import { useQuery, gql } from "@apollo/client"

import getCookie from "../shared/functions/getCookie"
import capitalize from "../shared/functions/capitalize"
import kFormatter from "../shared/functions/kFormatter"

import SubText from "../shared/SubText"
import Text from "../shared/Text"
import Video from "../shared/Video"

const twitchQuery = gql`
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

const TwitchStream = (props)  => {

    const { loading, data } = useQuery(twitchQuery, {
        variables: { 
            userId: getCookie("userId"),
            twitchUserId: props.to_id
        },
    })

    if(loading || typeof data === 'undefined' ) return null;

    return (
        <div>
            {data?.getTwitchStream.map(v => ({...v, platform: 'Twitch'})).filter((video) => {
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
        </div>
    )
};

export default TwitchStream;