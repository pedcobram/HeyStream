import React from "react";
import { useHistory } from "react-router-dom";
import { useQuery, gql, useMutation } from "@apollo/client"

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";
import getCookie from "#root/components/shared/functions/getCookie";

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const query = gql`
    query {
        getTwitchLinkAccount
    }
`;

const query2 = gql`
    query($userId: String!) {
        getTwitchUser(userId: $userId) {
            access_token
        }
    }
`;

const query3 = gql`
    query {
        getYoutubeLinkAccount
    }
`;

const query4 = gql`
    query($userId: String!) {
        getYoutubeUser(userId: $userId) {
            access_token
        }
    }
`;

const query5 = gql`
    query($userId: String!) {
        getTwitchUserInfo(userId: $userId) {
            id 
            login
            display_name
            profile_image_url
        }
    }   
`;

const query6 = gql`
    query($userId: String!) {
        getYoutubeUserInfo(userId: $userId) {
            title
            thumbnails {
                medium {
                    url
                    width
                    height
                }
            }
        }
    }
`;

const mutation = gql`
    mutation($userId: String!) {
        deleteTwitchSession(userId: $userId)
    }
`;

const mutation2 = gql`
    mutation($userId: String!) {
        deleteYoutubeSession(userId: $userId)
    }
`;

const Account = () => {

    if (!getCookie("userId")) useHistory().push("/");

    const {data: twitchAccount} = useQuery(query);
    
    const { refetch: refetchTwitchUser} = useQuery(query2, {
        variables: { 
            "userId": getCookie("userId")
        }
    })

    const { data: youtubeLink} = useQuery(query3);
    
    const { refetch: refetchYoutubeUser} = useQuery(query4, { 
        variables: { 
            "userId": getCookie("userId")
        }
    })
    
    const { data: twUserInfo } = useQuery(query5, { 
        variables: { 
            "userId": getCookie("userId")
        }
    })

    const { data: ytUserInfo } = useQuery(query6, { 
        variables: { 
            "userId": getCookie("userId")
        }
    });

    console.log(ytUserInfo)

    const [deleteTwitchSession] = useMutation(mutation);
    const [deleteYoutubeSession] = useMutation(mutation2);

    return (
        <div>
            <CustomNavBar/>
            <div >
                <div className="centerDiv marginBottonAccount">
                    <div className="white ">
                        <h2>Link Accounts</h2>
                    </div>
                </div>
                {getCookie("twitchAccessToken") ?
                    <div >
                        {twUserInfo ? 
                            <div className="centerDiv marginBottonAccount">
                                <div className="white marginRightAccount">
                                    Account: {twUserInfo.getTwitchUserInfo?.display_name}  
                                    <img src={twUserInfo.getTwitchUserInfo?.profile_image_url} width="40px" height="40px"/>
                                </div>
                            </div>
                        : 
                            null}
                        <div className="centerDiv marginBottonAccounts marginRightAccount">
                            <a className="btn btn-dark" href="#" onClick={evt => {
                                evt.preventDefault();
                                deleteTwitchSession({ variables: { userId: getCookie("userId") }});
                                refetchTwitchUser();
                            }}> 
                                Unlink Twitch Account
                            </a>   
                        </div>
                    </div>
                :
                    <div className="centerDiv marginBottonAccounts">
                        <div>
                            <a className="btn btn-dark" href={twitchAccount?.getTwitchLinkAccount.replace('\"', '').slice(0, -1)}> Link Twitch Account</a>   
                        </div>
                    </div>
                }
                <div className="centerDiv marginBottonAccount">
                    {getCookie("youtubeAccessToken") ? 
                        <div >
                            {ytUserInfo ? 
                                <div className="white marginRightAccount">
                                    Account: {ytUserInfo.getYoutubeUserInfo?.title}  
                                    <img src={ytUserInfo.getYoutubeUserInfo?.thumbnails.medium.url} width="40px" height="40px"/>
                                </div>
                            : 
                                null}
                            <div className="centerDiv marginBottonAccount marginRightAccount">
                                <a className="btn btn-dark" href="#" onClick={evt => {
                                evt.preventDefault();
                                deleteYoutubeSession({ variables: { userId: getCookie("userId") }});
                                refetchYoutubeUser(); 
                            }}> Unlink Youtube Account</a>   
                            </div>
                        </div>
                        
                    :
                        <div >
                            <div>
                                <a className="btn btn-dark" href={youtubeLink?.getYoutubeLinkAccount.replace('\"', '').slice(0, -1)}> Link Youtube Account</a>   
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Account;
