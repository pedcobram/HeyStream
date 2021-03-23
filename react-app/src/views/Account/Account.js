import React, { useEffect, useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client"
import styled from "styled-components";

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";
import graphqlClient from "#root/api/graphql/graphqlClient";
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

const rowStyle = {
    marginTop: "0.5rem",
    marginBottom: "4rem",
};

const Title = styled.h2`
    color: var(--silver)
`;

const Account = () => {

    const [twitchLink, setTwitchLink] = useState(String);

    const [deleteTwitchSession] = useMutation(mutation);
    const [deleteYoutubeSession] = useMutation(mutation2);

    const { data, refetch: refetchTwitchUser } = useQuery(query2, {
        variables: { 
        "userId": getCookie("userId")
        }
    })

    const { data: youtubeLink } = useQuery(query3);
    
    const { data: youtubeUser, refetch: refetchYoutubeUser } = useQuery(query4, { 
        variables: { 
        "userId": getCookie("userId")
        }
    })

    useEffect(() => {
        graphqlClient.query({ query }).then(({ data }) => {
            if(data.getTwitchLinkAccount) {
                setTwitchLink(data.getTwitchLinkAccount)
            }
        })
    }, []); 

    return (
        <div>
            <CustomNavBar/>
            <Container fluid >
                <Row style={rowStyle}>
                    <Col md={{ span: 0, offset: 8 }}>
                        <Title>Link Accounts</Title>
                    </Col>
                </Row>
                {data?.getTwitchUser ?
                    <Row style={rowStyle}>
                        <Col md={{ span: 0, offset: 8 }}>
                        <a className="btn btn-dark" href={twitchLink.replace('\"', '').slice(0, -1)} onClick={evt => {
                            evt.preventDefault();
                            deleteTwitchSession({ variables: { userId: getCookie("userId") }});
                            refetchTwitchUser();
                        }}> 
                            Unlink Twitch Account
                        </a>   
                        </Col>
                    </Row>
                :
                    <Row style={rowStyle}>
                        <Col md={{ span: 0, offset: 8 }}>
                            <a className="btn btn-dark" href={twitchLink.replace('\"', '').slice(0, -1)}> Link Twitch Account</a>   
                        </Col>
                    </Row>
                }
                {youtubeUser?.getYoutubeUser ?
                    <Row style={rowStyle}>
                        <Col md={{ span: 0, offset: 8 }}>
                            <a className="btn btn-dark" href={youtubeLink?.getYoutubeLinkAccount.replace('\"', '').slice(0, -1)} onClick={evt => {
                            evt.preventDefault();
                            deleteYoutubeSession({ variables: { userId: getCookie("userId") }});
                            refetchYoutubeUser(); 
                        }}> Unlink Youtube Account</a>   
                        </Col>
                    </Row>
                    
                :
                    <Row style={rowStyle}>
                        <Col md={{ span: 0, offset: 8 }}>
                            <a className="btn btn-dark" href={youtubeLink?.getYoutubeLinkAccount.replace('\"', '').slice(0, -1)}> Link Youtube Account</a>   
                        </Col>
                    </Row>
                }
            </Container>
        </div>
    );
}

export default Account;
