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

    type ItemStream {
        id: ytID!
        snippet: SnippetStream!
    }   
    
    type Medium {
        url: String!
        width: String!
        height: String!
    }

    type Thumbnail {
        medium: Medium!
    }

    type SnippetStream {
        publishedAt: Date!
        channelId: String!
        title: String!
        description: String!
        thumbnails: Thumbnail!
        channelTitle: String!
        liveBroadcastContent: String!
    }

    type YoutubeStream {
        nextPageToken: String
        pageInfo: PageInfo!
        items: [ItemStream!]!
    }

    type YoutubeResource {
        channelId: String!
    }

    type SnippetChannel {   
        resourceId: YoutubeResource!
    }

    type ItemChannel {
        snippet: SnippetChannel!
    }

    type YoutubeChannel {
        nextPageToken: String
        pageInfo: PageInfo!
        items: [ItemChannel!]!
    }

    type TwitchFollowedData {
        to_id: String!
        to_login: String!
        to_name: String!
    }

    type TwitchFollowed {
        total: String!
        data: [TwitchFollowedData!]!
    }

    type ytChannelItem{
        id: ytID
        snippet: SnippetStream
    }

    type ItemYoutubeChannel {
        items: [ytChannelItem]
    }

    type YoutubeStreams {
        response: [ItemYoutubeChannel]
    }

    type TwitchUserInfo {
        id: String!
        login: String!
        display_name: String!
        profile_image_url: String!
    }

    type YoutubeUserInfo {
        title: String!
        thumbnails: Thumbnail!
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

    type TwitchVod {
        id: String
        user_id: String
        user_login: String
        user_name: String
        title: String
        description: String
        created_at: Date
        published_at: Date
        url: String
        thumbnail_url: String
        viewer_count: String
        duration: String
    }

    type TwitchVods {
        data: [TwitchVod]
        pagination: String
    }

    type YoutubeChannelId {
        channelId: String
    }

    type TwitchClip {
        url: String!
        title: String!
        vod_timestamp: String!
        game: String!
        impressions: String!
        percentaje: String!
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
        getYoutubeVideosNoLogin: YoutubeStream
        getTwitchStreams(userId: String!): [TwitchVideo]
        getFollowedYoutubeUsers(userId: String!): YoutubeChannel!
        getYoutubeStreams(userId: String!): YoutubeStreams!
        getTwitchUserInfo(userId: String!): TwitchUserInfo!
        getYoutubeUserInfo(userId: String!): YoutubeUserInfo!
        getTwitchVods(userId: String!, loginName: String!): TwitchVods
        getYoutubeVods(userId: String!, channelId: String!): YoutubeStream
        getYoutubeChannelId(userId: String!, videoId: String!): YoutubeChannelId
        getTwitchStreamClips(userId: String!, videoId: String!): [TwitchClip!]!
    }
`;

export default typeDefs;