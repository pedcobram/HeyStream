import got from "got";

const TWITCH_SERVICE_URI = "http://twitch-service:7103";

export default class TwitchService {
 
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

    static async getFollowedTwitchUsers({ userId }) {
        const body = await got.post(`${TWITCH_SERVICE_URI}/twitch/user/followed`, {
            json: {
                userId
            }
        });
        return body;
    }

    static async getTwitchStream({ userId, twitchUserId }) {
        const body = await got.post(`${TWITCH_SERVICE_URI}/twitch/stream`, {
            json: {
                userId,
                twitchUserId
            }
        });
        return body;
    }

    static async getAllTwitchUsers() {
        const body = await got.get(`${TWITCH_SERVICE_URI}/twitch`).json();
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