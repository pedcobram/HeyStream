import got from "got";

const YOUTUBE_SERVICE_URI = "http://youtube-service:7102";

export default class YoutubeService {

    static async YoutubeLinkAccount() {
        const body = await got.get(`${YOUTUBE_SERVICE_URI}/youtube/link`);
        return body;
    }

    static async YoutubeLinkAccountLanding({ code, userId }) {
        const body = await got.post(`${YOUTUBE_SERVICE_URI}/youtube/link`, {
            json: {
                code,
                userId
            }
        });
        return body;
    }

    static async getFollowedYoutubeUsers({ userId }) {
        const body = await got.post(`${YOUTUBE_SERVICE_URI}/youtube/user/followed`, {
            json: {
                userId
            }
        });
        return body;
    }

    static async getYoutubeStream({ userId, channelId }) {
        const body = await got.post(`${YOUTUBE_SERVICE_URI}/youtube/stream`, {
            json: {
                userId,
                channelId
            }
        });
        return body;
    }

    static async fetchYoutubeUserByUserId({ userId }) {
        const body = await got.get(`${YOUTUBE_SERVICE_URI}/youtube/${userId}`).json();
        return body;
    }

    static async getYoutubeVideosNoLogin() {
        const body = await got.get(`${YOUTUBE_SERVICE_URI}/youtube/videos`).json();
        return body;
    }

    static async deleteYoutubeSession({ userId }){
        const body = await got.delete(`${YOUTUBE_SERVICE_URI}/youtube/${userId}`).json();
        return body;
    }

}