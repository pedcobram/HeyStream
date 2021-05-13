import React from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import Grid from 'react-css-grid';

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";

import TextInput from "#root/components/shared/TextInput";
import Video from "#root/components/shared/Video";
import SubText from "#root/components/shared/SubText";
import Text from "#root/components/shared/Text";

const twitchQuery = gql`
    query($query: String!) {
        getTwitchQuery(query: $query) {
            id
            display_name
            is_live
            thumbnail_url
            title
            game_id
        }
    }
`;

const youtubeQuery = gql`
    query($query: String!) {
        getYoutubeQuery(query: $query) {
            data {
                nextPageToken
                pageInfo {
                  totalResults
                  resultsPerPage
                }
                items {
                  snippet {
                    publishedAt
                    channelId
                    title
                    description
                    thumbnails {
                      medium {
                        url
                      }
                    }
                    channelTitle
                    liveBroadcastContent
                  }
                }
              }
              liveArray
        }
    }
`;

const Label = styled.label`
    display: block;
`;

const LabelText = styled.strong`
    display: block;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
    border: none;
`;

const LoginButton = styled.button`
    display: inline-block;
    margin-top: 0.5rem;;
`;

const Search = () => {

    const [twitchQueryData, { data: dataTW }] = useLazyQuery(twitchQuery);
    const [youtubeQueryData, { data: dataYT }] = useLazyQuery(youtubeQuery);

    const {
        formState: { isSubmitting: isSubmittingTW },
        handleSubmit: handleSubmitTW,
        register: registerTW
    } = useForm(); 

    const {
        formState: { isSubmitting: isSubmittingYT },
        handleSubmit: handleSubmitYT,
        register: registerYT
    } = useForm(); 

    const onSubmitTW = handleSubmitTW(async ({ query }) => {   
        await twitchQueryData({ 
            variables: { 
                query 
            } 
        });
    });

    const onSubmitYT = handleSubmitYT(async ({ query }) => {   
        await youtubeQueryData({ 
            variables: { 
                query 
            } 
        });
    });

    return (
        <div>
            <CustomNavBar/>
            <div className="containerQuery">
                <div className="twitchQuery"> 
                    <form id="loginForm" className="text-right" name="form" onSubmit = { onSubmitTW }>
                        <Label>
                            <LabelText id="labelText" className="input-group-text">Search Twitch channels</LabelText>
                            <TextInput id="input" className="form-control mr-sm-2" disabled={isSubmittingTW} name="query" type="text" ref={registerTW} required={true}/>
                        </Label>
                        <LoginButton id="loginButton" className="btn btn-primary my-2 my-sm-0" disabled={isSubmittingTW} type="submit" >Search</LoginButton>            
                    </form>
                    <Grid className="centered channelContainer">  
                        {dataTW?.getTwitchQuery.map((twdata, idx) => (
                            <Video key={idx}>
                                <div className="container">
                                    {twdata.is_live == "true" ?
                                        <a href={"/twitch/stream/{user}".replace('{user}', twdata.display_name)}>
                                            <img className="queryImage" src={twdata.thumbnail_url} />
                                        </a>
                                    :
                                        <a href={"/twitch/vods/{user}".replace('{user}', twdata.display_name)}>
                                            <img className="queryImage" src={twdata.thumbnail_url} />
                                        </a>
                                    }
                                    <div className="bottom-right">
                                        {twdata.is_live == "true" ? 
                                            <p className="live">Live</p>
                                        :   
                                            <p className="viewers">Offline</p>
                                        }
                                    </div>
                                </div>
                                <Text title={twdata.display_name}>{twdata.display_name}</Text>
                                <SubText>{twdata.title}</SubText>
                            </Video>
                        ))}
                    </Grid>
                </div>
                <div className="youtubeQuery"> 
                    <form id="loginForm" className="text-right" name="form" onSubmit = { onSubmitYT }>
                        <Label>
                            <LabelText id="labelText" className="input-group-text">Search YouTube channels</LabelText>
                            <TextInput id="input" className="form-control mr-sm-2" disabled={isSubmittingYT} name="query" type="text" ref={registerYT} required={true}/>
                        </Label>
                        <LoginButton id="loginButton" className="btn btn-primary my-2 my-sm-0" disabled={isSubmittingYT} type="submit" >Search</LoginButton>               
                    </form>
                    <Grid className="centered channelContainer">  
                        {dataYT?.getYoutubeQuery.data.items.map((ytdata, idx) => (
                            <Video key={idx}>
                                <div className="container">
                                    {ytdata.snippet.liveBroadcastContent == "live" ? 
                                        <a href={"/youtube/stream/{videoId}".replace('{videoId}', dataYT.getYoutubeQuery.liveArray[idx])}>
                                            <img className="queryImage" src={ytdata.snippet.thumbnails.medium.url} />
                                        </a>
                                    :
                                        <a href={"/youtube/vods/{channelId}".replace('{channelId}', ytdata.snippet.channelId)}>
                                            <img className="queryImage" src={ytdata.snippet.thumbnails.medium.url} />
                                        </a>
                                    }
                                    <div className="bottom-right">
                                        {ytdata.snippet.liveBroadcastContent == "live" ? 
                                            <p className="live">Live</p>
                                        :   
                                            <p className="viewers">Offline</p>
                                        }
                                    </div>
                                </div>
                                <Text title={ytdata.snippet.channelTitle}>{ytdata.snippet.channelTitle}</Text>
                            </Video>
                        ))}
                    </Grid>
                </div>
            </div>
        </div>
    );
}

export default Search;
