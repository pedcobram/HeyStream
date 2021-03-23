import React from "react";
import { useQuery, gql } from "@apollo/client"

import getCookie from "../shared/functions/getCookie"

import TwitchStream from "../TwitchStream"
import Container from "../shared/Container"

const twitchQuery = gql`
    query($userId: String!) {
        getFollowedTwitchUsers(userId: $userId) {
        total
        data {
            to_id
            to_login
            to_name
        }
        }
    }
`;

const MyTwitchStreams = ()  => {

    const { loading, error, data } = useQuery(twitchQuery, {
        variables: { 
            userId: getCookie("userId")
        },
    });

    if (loading || !data) return null;

    return (
        <Container>
            {data?.getFollowedTwitchUsers.data.map((item, idx) => (
                <TwitchStream key={idx} to_id={item.to_id} to_login={item.to_login} to_name={item.to_name}></TwitchStream>
            ))}
        </Container>
    )
};

export default MyTwitchStreams;