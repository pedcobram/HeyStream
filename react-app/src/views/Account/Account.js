import React, { useEffect, useState } from "react";
import gql from "graphql-tag";

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

const rowStyle = {
    marginTop: "0.5rem",
    marginBottom: "4rem",
};

const Account = () => {

    const [twitchLink, setTwitchLink] = useState(String);

    useEffect(() => {
        graphqlClient.query({ query }).then(({ data }) => {
            if(data.getTwitchLinkAccount) {
                setTwitchLink(data.getTwitchLinkAccount)
            }
        })
    }, []);  

    return (
        <Wrapper>
            <CustomNavBar/>

            <Container fluid >
                <Row style={rowStyle}>
                    <Col md={{ span: 0, offset: 8 }}>
                        <h2>Link Accounts</h2>
                    </Col>
                </Row>
                <Row style={rowStyle}>
                    <Col md={{ span: 0, offset: 8 }}>
                        <a className="btn btn-dark" href={twitchLink.replace('\"', '').slice(0, -1)}> Link Twitch Account</a>   
                    </Col>
                </Row>
            </Container>
        </Wrapper>
    );
}

export default Account;
