import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";

import MyTwitchStreams from '#root/components/MyTwitchStreams';
import MyYoutubeStreams from '#root/components/MyYoutubeStreams';

import getCookie from "#root/components/shared/functions/getCookie";

import Filters from "#root/components/shared/Filters";
import Filter from "#root/components/shared/Filter";
import FilterText from "#root/components/shared/FilterText";
import PlatformText from "#root/components/shared/PlatformText";

const twitchQuery = gql`
    query($userId: String!) {
        getTwitchStreams(userId: $userId) {
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

const youtubeQuery = gql`
    query($userId: String!) {
        getYoutubeStreams(userId: $userId) {
            response {
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
    }
`;

const MyStreams = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [visibleTwitchStreams, setVisibleTwitchStreams] = useState(5);
    const [visibleYoutubeStreams, setVisibleYoutubeStreams] = useState(5);

    const { data: twData, loading: twLoading } = useQuery(twitchQuery, {
        variables: { 
            userId: getCookie("userId")
        },
    }); 

    const { data: ytData, loading: ytLoading } = useQuery(youtubeQuery, {
        variables: { 
            userId: getCookie("userId")
        }
    });

    var twitchDataLen = twData?.getTwitchStreams.length;
    var youtubeDataLen = ytData?.getYoutubeStreams.response.length;

    function updateState(searchTerm, param) {
        if(searchTerm == param) {
            setSearchTerm('');
        } else {
            setSearchTerm(param);
        }
    }

    const clickSeeMoreTwitch = () => {
        setVisibleTwitchStreams(twitchDataLen);
    }

    const clickSeeLessTwitch = () => {
        setVisibleTwitchStreams(5);
    }

    const clickSeeMoreYoutube = () => {
        setVisibleYoutubeStreams(youtubeDataLen);
    }

    const clickSeeLessYoutube = () => {
        setVisibleYoutubeStreams(5);
    }

    return (
    <div>
        <CustomNavBar/>
        <Filters>
            <FilterText>Filters: </FilterText>
            <Filter>
                <button className="btn btn-primary" onClick={() => {
                    updateState(searchTerm, 'Twitch')
                }}>Twitch</button>
            </Filter>
            <Filter>
                <button className="btn btn-primary" onClick={() => {
                    updateState(searchTerm, 'YouTube')
                }}>YouTube</button>
            </Filter>
            <Filter>
                <input type="text" onChange={e => setSearchTerm(e.target.value)} placeholder="Search by name or game..."/>
            </Filter>
        </Filters>
        <div className="right">
            {twData ?
                visibleTwitchStreams == twitchDataLen ?
                    <button className="btn btn-dark" type="button" onClick={clickSeeLessTwitch}>
                        See less Twitch Streams
                    </button>
                :
                    <button className="btn btn-dark" type="button" onClick={clickSeeMoreTwitch}> 
                        See more Twitch Streams
                    </button>
            :
                null                
            }
        </div>
        <PlatformText>Twitch Streams: </PlatformText>
        <MyTwitchStreams searchTerm={searchTerm} visibleStreams={visibleTwitchStreams} videos={twData?.getTwitchStreams} loading={twLoading}/>
        <br/>
        <div className="right">
            {ytData ? 
                visibleYoutubeStreams == youtubeDataLen ?
                    <button className="btn btn-dark" type="button" onClick={clickSeeLessYoutube}>
                        See less Youtube Streams
                    </button>
                :
                    <button className="btn btn-dark" type="button" onClick={clickSeeMoreYoutube}> 
                        See more Youtube Streams
                    </button>
            :
                null
            }
        </div>
        <PlatformText>Youtube Streams: </PlatformText>
        <MyYoutubeStreams searchTerm={searchTerm} visibleStreams={visibleYoutubeStreams} videos={ytData} loading={ytLoading}/>
    </div>
    );
}

export default MyStreams;