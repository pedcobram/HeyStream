import React from "react";
import { useQuery, gql } from "@apollo/client";
import Grid from 'react-css-grid';
import { useParams } from "react-router-dom";

import SubText from "#root/components/shared/SubText";
import Text from "#root/components/shared/Text";
import Video from "#root/components/shared/Video";

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

    const { channelId } = useParams();

    const { data, loading, error } = useQuery(query, {
        variables: { 
            userId: getCookie("userId"),
            channelId: channelId
        },
        errorPolicy: "all"
    }); 

    if (loading) return null;

    return (
        <div>
            <CustomNavBar/>
            <Grid className="centered">  
                {data?.getYoutubeVods.items.map((vod, idx) => (
                    <Video key={idx}>
                        <div className="container">
                            <a href={'/youtube/vod/' + vod.id.videoId} >
                                {vod.snippet.thumbnails ? 
                                    <img src={vod.snippet.thumbnails.medium.url} width="320px" height="180px"/>
                                :
                                    <img src="" width="320px" height="180px"/>
                                }
                            </a>
                        </div>
                        <Text title={vod.snippet.title}>{vod.snippet.title}</Text>
                        <SubText>{vod.snippet.channelTitle}</SubText>
                    </Video>
                ))}
            </Grid>
            
        </div>
    );
}

export default TwitchVods;
