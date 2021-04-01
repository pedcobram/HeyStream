import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";
import TwitchVideosNoLogin from "#root/components/TwitchVideosNoLogin";
import YoutubeVideosNoLogin from "#root/components/YoutubeVideosNoLogin";

import Filters from "#root/components/shared/Filters";
import Filter from "#root/components/shared/Filter";
import FilterText from "#root/components/shared/FilterText";

const youtubeQuery = gql`
    query {
        getYoutubeVideosNoLogin {
            nextPageToken
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

const twitchQuery = gql`
    {
        getTwitchVideosNoLogin {
            id
            user_id
            user_login
            user_name
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

const Home = () => {

    const [searchTerm, setSearchTerm] = useState('')

    function updateState(searchTerm, param) {
        if(searchTerm == param) {
            setSearchTerm('')
        } else {
            setSearchTerm(param)
        }
    }

    const {data: youtubeVideos} = useQuery(youtubeQuery);
    const {data: twitchVideos} = useQuery(twitchQuery);

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
            </Filters>
            <TwitchVideosNoLogin videos={twitchVideos} searchTerm={searchTerm}/>
            <YoutubeVideosNoLogin videos={youtubeVideos} searchTerm={searchTerm} />
        </div>
    );
}

export default Home;
