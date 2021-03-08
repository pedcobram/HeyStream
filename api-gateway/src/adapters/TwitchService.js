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

    static async getAllTwitchUsers() {
        const body = await got.get(`${TWITCH_SERVICE_URI}/twitch`).json();
        return body;
    }

    static async fetchTwitchUser({ id }) {
        const body = await got.get(`${TWITCH_SERVICE_URI}/twitch/${id}`).json();
        return body;
    }

}