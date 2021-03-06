import got from "got";

const TWITCH_SERVICE_URI = "http://twitch-service:7103";

export default class TwitchService {
 
    static async TwitchLinkAccount() {
        const body = await got.get(`${TWITCH_SERVICE_URI}/twitch/link`);
        return true;
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