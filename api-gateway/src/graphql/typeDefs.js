import { gql } from "apollo-server";

const typeDefs = gql`
    scalar Date

    type User {
        email: String!
        id: ID!
    }

    type Twitch {
        id: ID!
        userId: User!
        access_token: String!
        refresh_token: String!
    }

    type Youtube {
        id: ID!
        userId: User!
        access_token: String!
        refresh_token: String!
    }

    type UserSession {
        createdAt: Date!
        expiresAt: Date!
        id: ID!
        user: User!
    }

    type TwitchVideo {
        id: String!
        user_id: String!
        user_login: String!
        user_name: String!
        game_id: String!
        game_name: String!
        type: String!
        title: String!
        viewer_count: String!
        started_at: Date!
        language: String!
        thumbnail_url: String!
        tag_ids: [String!]!
    }

    type Mutation {
        createUser(email: String!, password: String!): User!
        createUserSession(email: String!, password: String!): UserSession!
        deleteUserSession(sessionId: ID!): Boolean!
        twitchLanding(code: String!, userId: String!): Boolean!
        deleteTwitchSession(userId: String!): Boolean!
        youtubeLanding(code: String!, userId: String!): Boolean!
        deleteYoutubeSession(userId: String!): Boolean!
    }

    type Query {
        userSession(me: Boolean!): UserSession
        getUser(id: String!): User
        getTwitchUser(userId: String!): Twitch
        getAllTwitchUsers: [Twitch!]!
        getTwitchLinkAccount: String!
        getYoutubeLinkAccount: String!
        getYoutubeUser(userId: String!): Youtube
        getTwitchVideosNoLogin: [TwitchVideo!]!
    }
`;

export default typeDefs;