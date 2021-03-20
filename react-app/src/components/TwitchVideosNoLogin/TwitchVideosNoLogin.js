import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client"
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

const TwitchVideosNoLogin = ()  => {

    const [searchTerm, setSearchTerm] = useState('')

    const {data: videos} = useQuery(query);

    function updateState(searchTerm, param) {
        if(searchTerm == param) {
            setSearchTerm('')
        } else {
            setSearchTerm(param)
        }
    }

    const capitalize = (s) => {
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    function kFormatter(num) {
        return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
    }

    console.log(kFormatter(300178))

    return (
        <div>
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
            <Container>
                {videos?.getTwitchVideosNoLogin.map(v => ({...v, platform: 'Twitch'})).filter((video) => {
                    if(searchTerm == '') {
                        return video
                    } else if (video.platform.toLowerCase() == searchTerm.toLowerCase()) {
                        return video
                    }
                }).map((video, idx) => (
                    <Video key={idx}>
                        <div className="container">
                            <a href={"/twitch/{user}".replace('{user}', video.user_name)}>
                                <img src={video.thumbnail_url.replace('{width}', 320).replace('{height}', 180)} />
                            </a>
                            <div className="bottom-right">
                                <p className="live">
                                    {capitalize(video.type)}
                                </p>
                            </div>
                            <div className="bottom-left">
                                <div className="viewers">
                                    {kFormatter(video.viewer_count)} viewers
                                </div>
                            </div>
                        </div>
                        <Text title={video.title}>{video.title}</Text>
                        <SubText>{video.user_name}</SubText>
                        <SubText>{video.game_name}</SubText>
                    </Video>
                ))}
            </Container>
        </div>

    )
};

export default TwitchVideosNoLogin;