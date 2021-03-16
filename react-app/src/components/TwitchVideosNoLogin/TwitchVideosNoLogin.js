import React, { useState, useEffect } from "react";
import { useQuery, gql, useMutation } from "@apollo/client"
import graphqlClient from "#root/api/graphql/graphqlClient";

import "bootstrap/dist/css/bootstrap.min.css";

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

const TwitchVideosNoLogin = (props) => {
    
    const {data: videos, loading} = useQuery(query)

    if(loading) return "Cargando :P"

    return (
        <>
            {videos.getTwitchVideosNoLogin.map((item) => (
                <li key={item.id}>{item.id}</li>
            ))}
        </>
    )
};

export default TwitchVideosNoLogin;