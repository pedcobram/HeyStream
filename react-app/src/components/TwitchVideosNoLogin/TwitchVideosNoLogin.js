import React from "react";
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


const TwitchVideosNoLogin = (props)  => {

    const capitalize = (s) => {
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    function kFormatter(num) {
        return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
    }

    return (
        <div>
            <Container>
                {props.videos?.getTwitchVideosNoLogin.map(v => ({...v, platform: 'Twitch'})).filter((video) => {
                    console.log(props.searchTerm)
                    if(props.searchTerm == '') {
                        return video
                    } else if (video.platform.toLowerCase() == props.searchTerm.toLowerCase()) {
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