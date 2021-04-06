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
    query($userId: String!, $channelId: String!) {
        getYoutubeVods(userId: $userId, channelId: $channelId) {
            nextPageToken
            pageInfo {
                totalResults
                resultsPerPage
            }
            items {
                id {
                    videoId
                }
                snippet {
                    publishedAt
                    channelId
                    title
                    description
                    thumbnails {
                        medium {
                            url
                            width
                            height
                        }
                    }
                    channelTitle
                    liveBroadcastContent
                }
            }
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

    console.log(data?.getYoutubeVods)

    /*
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
    */

    return (
        <div>
            <CustomNavBar/>
            
        </div>
    );
}

export default TwitchVods;
