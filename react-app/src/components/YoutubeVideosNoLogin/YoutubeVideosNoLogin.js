import React, { useState } from "react";
import { gql } from "@apollo/client"
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

const YoutubeVideosNoLogin = (props)  => {

    const capitalize = (s) => {
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    return (
        <div>
            <Container>
                {props.videos?.getYoutubeVideosNoLogin.items.map(v => ({...v, platform: 'YouTube'})).filter((video) => {
                    console.log(props.searchTerm)
                    if(props.searchTerm == '') {
                        return video
                    } else if (video.platform.toLowerCase() == props.searchTerm.toLowerCase()) {
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