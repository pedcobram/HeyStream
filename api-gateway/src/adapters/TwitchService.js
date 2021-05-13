import got from "got";

const TWITCH_SERVICE_URI = "http://twitch-service:7103";

export default class TwitchService {

    static async getTwitchQuery({ query }) {
        const body = await got.post(`${TWITCH_SERVICE_URI}/twitch/search`, {
            json: {
                query
            }
        });
        return body;
    }

    static async getTwitchVideoInfo({ videoId }) {
        const body = await got.post(`${TWITCH_SERVICE_URI}/twitch/video/videoId`, {
            json: {
                videoId
            }
        });
        return body;
    }
 
    static async TwitchLinkAccount() {
        const body = await got.get(`${TWITCH_SERVICE_URI}/twitch/link`);
        return body;
    }

    static async TwitchLinkAccountLanding({ code, userId }) {
        const body = await got.post(`${TWITCH_SERVICE_URI}/twitch/link`, {
            json: {
                code,
                userId
            }
        });
        return body;
    }

    static async getTwitchStreamClips({ userId, videoId }) {
        const body = await got.post(`${TWITCH_SERVICE_URI}/twitch/vod/clips`, {
            json: {
                userId,
                videoId
            }
        });
        return body;
    }

    static async getTwitchStreams({ userId }) {
        const body = await got.post(`${TWITCH_SERVICE_URI}/twitch/streams`, {
            json: {
                userId
            }
        });
        return body;
    }

    static async getAllTwitchUsers() {
        const body = await got.get(`${TWITCH_SERVICE_URI}/twitch`).json();
        return body;
    }

    static async getTwitchUserInfo({ userId }) {
        const body = await got.post(`${TWITCH_SERVICE_URI}/twitch/user`, {
            json: {
                userId
            }
        }).json();
        return body.data[0];
    }

    static async getTwitchVods({ loginName }) {
        const body = await got.post(`${TWITCH_SERVICE_URI}/twitch/streams/vods`, {
            json: {
                loginName
            }
        }).json();
        return body;
    }

    static async fetchTwitchUserByUserId({ userId }) {
        const body = await got.get(`${TWITCH_SERVICE_URI}/twitch/${userId}`).json();
        return body;
    }

    static async getTwitchVideosNoLogin() {
        const body = await got.get(`${TWITCH_SERVICE_URI}/twitch/videos`).json();
        return body;
    }

    static async deleteTwitchSession({ userId }){
        const body = await got.delete(`${TWITCH_SERVICE_URI}/twitch/${userId}`).json();
        return body;
    }

}