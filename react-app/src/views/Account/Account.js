import React, { useEffect, useState } from "react";
/* import gql from "graphql-tag"; */
import { useQuery, gql, useMutation } from "@apollo/client"
/* import  { useMutation } from "@apollo/react-hooks"; */
import styled from "styled-components";

import CustomNavBar from "#root/components/CustomNavBar/CustomNavBar";
import graphqlClient from "#root/api/graphql/graphqlClient";

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Label = styled.label`
  display: block;
  :not(:first-child) {
    margin-top: 0.75rem;
  }
`;

const Wrapper = styled.div`
    color: ${props => props.theme.mortar};
    font-size: 0.9rem;
`;

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

const mutation = gql`
    mutation($userId: String!) {
        deleteTwitchSession(userId: $userId)
    }
`;

const rowStyle = {
    marginTop: "0.5rem",
    marginBottom: "4rem",
};

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

const Account = () => {

    const [deleteTwitchSession] = useMutation(mutation);

    const [twitchLink, setTwitchLink] = useState(String);

    useEffect(() => {
        graphqlClient.query({ query }).then(({ data }) => {
            if(data.getTwitchLinkAccount) {
                setTwitchLink(data.getTwitchLinkAccount)
            }
        })
    }, []);  

    const { data } = useQuery(query2, {
        variables: { 
           "userId": getCookie("userId")
        }
    })

    return (
        <Wrapper>
            <CustomNavBar/>

            <Container fluid >
                <Row style={rowStyle}>
                    <Col md={{ span: 0, offset: 8 }}>
                        <h2>Link Accounts</h2>
                    </Col>
                </Row>
                {data?.getTwitchUser ?
                    <Row style={rowStyle}>
                        <Col md={{ span: 0, offset: 8 }}>
                        <a className="btn btn-dark" href={twitchLink.replace('\"', '').slice(0, -1)} onClick={evt => {
                            evt.preventDefault();
                            deleteTwitchSession({ variables: { userId: getCookie("userId") }});
                            setInterval(() => {
                                window.location.reload();
                            }, 100); 
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
            </Container>
        </Wrapper>
    );
}

export default Account;
