import React, { useState } from "react";
import { useQuery, gql, useLazyQuery } from "@apollo/client"
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 4rem;
    margin-top: 1rem;    
`;

const Video = styled.div`
    height: 240px;
    width: 320px;
    margin-top: 1rem;
`;

const Text = styled.div`
    font-size: 15px;
    color: rgb(189,189,189);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;

const SubText = styled.div`
    font-size: 13px;
    color: rgb(189,189,189);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;

const Filters = styled.div`
    display: flex;
    justify-content: left;
    width: 100%;
    padding-left: 4rem;
`;

const Filter = styled.div`
    padding-right: 1rem;
`;

const FilterText = styled.h3`
    color: var(--silver);
    padding-right: 1rem;
`;

const query = gql`
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

const YoutubeVideosNoLogin = ()  => {

    const [searchTerm, setSearchTerm] = useState('')

    const {data: videos} = useQuery(query);

    const capitalize = (s) => {
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    console.log(videos?.getYoutubeVideosNoLogin.items)

    return (
        <div>
            <Container>
                {videos?.getYoutubeVideosNoLogin.items.map(v => ({...v, platform: 'Youtube'})).filter((video) => {
                    if(searchTerm == '') {
                        return video
                    } else if (video.platform.toLowerCase() == searchTerm.toLowerCase()) {
                        return video
                    }
                }).map((video, idx) => (
                    <Video key={idx}>
                        <div className="container">
                            <a href={"/youtube/{user}".replace('{user}', video.id.videoId)}>
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
            </Container>
        </div>

    )
};

export default YoutubeVideosNoLogin;