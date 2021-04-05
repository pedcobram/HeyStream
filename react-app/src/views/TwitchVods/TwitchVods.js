import React from "react";
import { useQuery, gql } from "@apollo/client";
import Grid from 'react-css-grid';
import { useParams } from "react-router-dom";

import SubText from "#root/components/shared/SubText";
import Text from "#root/components/shared/Text";
import Video from "#root/components/shared/Video";

import capitalize from "#root/components/shared/functions/capitalize";
import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";

import getCookie from "#root/components/shared/functions/getCookie";

const query = gql`
    query($userId: String!, $loginName: String!) {
        getTwitchVods(userId: $userId, loginName: $loginName) {
            data {
                id
                user_id
                user_login
                title
                user_name
                description
                created_at
                published_at
                url
                thumbnail_url
                viewer_count
                duration
            }
            pagination
        }
    }
`;

const TwitchVods = () => {

    const {user} = useParams();

    const { data, loading, error } = useQuery(query, {
        variables: { 
            userId: getCookie("userId"),
            loginName: user
        },
        errorPolicy: "all"
    }); 

    if (loading) return null

    console.log(data?.getTwitchVods)

    return (
        <div>
            <CustomNavBar/>
            <Grid className="centered">  
            {data?.getTwitchVods.data.map((vod, idx) => (
                <Video key={idx}>
                    <div className="container">
                        <a href={'/twitch/vod/' + vod.id} >
                            {vod.thumbnail_url ? 
                                <img src={vod.thumbnail_url.replace('%{width}', 320).replace('%{height}', 180)} width="320px" height="180px"/>
                            :
                                <img src="" width="320px" height="180px"/>
                            }
                        </a>
                        <div className="bottom-left">
                            <div className="viewers">
                                {vod.duration}
                            </div>
                        </div>
                    </div>
                    <Text title={vod.title}>{vod.title}</Text>
                    <SubText>{vod.user_name}</SubText>
                </Video>
            ))}
        </Grid>
        </div>
    );
}

export default TwitchVods;
