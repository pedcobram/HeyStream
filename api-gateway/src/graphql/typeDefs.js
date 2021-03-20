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

    type PageInfo {
        totalResults: String!
        resultsPerPage: String!
    }

    type ytID {
        videoId: String!
    }

    type Item {
        id: ytID!
        snippet: Snippet!
    }   
    
    type Medium {
        url: String!
        width: String!
        height: String!
    }

    type Thumbnail {
        medium: Medium!
    }

    type Snippet {
        publishedAt: Date!
        channelId: String!
        title: String!
        description: String!
        thumbnails: Thumbnail!
        channelTitle: String!
        liveBroadcastContent: String!
    }

    type YoutubeVideo {
        nextPageToken: String!
        items: [Item!]!
        pageInfo: PageInfo!
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
        getYoutubeVideosNoLogin: YoutubeVideo
    }
`;

export default typeDefs;