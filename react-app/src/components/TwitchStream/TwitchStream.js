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

    if(loading || !data ) return null;

    return (
        <Video>
            <div className="container">
                <a href={"/twitch/{user}".replace('{user}', data?.getTwitchStream[0].user_name)}>
                    <img src={data?.getTwitchStream[0].thumbnail_url.replace('{width}', 320).replace('{height}', 180)} />
                </a>
                <div className="bottom-right">
                    <p className="live">
                        {capitalize(data?.getTwitchStream[0].type)}
                    </p>
                </div>
                <div className="bottom-left">
                    <div className="viewers">
                        {kFormatter(data?.getTwitchStream[0].viewer_count)} viewers
                    </div>
                </div>
            </div>
            <Text title={data?.getTwitchStream[0].title}>{data?.getTwitchStream[0].title}</Text>
            <SubText>{data?.getTwitchStream[0].user_name}</SubText>
            <SubText>{data?.getTwitchStream[0].game_name}</SubText>
        </Video>
    )
};

export default TwitchStream;