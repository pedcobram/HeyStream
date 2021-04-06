import got from "got";

const YOUTUBE_SERVICE_URI = "http://youtube-service:7102";

export default class YoutubeService {

    static async YoutubeLinkAccount() {
        const body = await got.get(`${YOUTUBE_SERVICE_URI}/youtube/link`);
        return body;
    }

    static async getYoutubeChannelId({ userId, videoId }) {
        const body = await got.post(`${YOUTUBE_SERVICE_URI}/youtube/stream/channelId`, {
            json: {
                userId,
                videoId
            }
        });
        return JSON.parse(body.body);
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

    static async getYoutubeStreams({ userId }) {
        const body = await got.post(`${YOUTUBE_SERVICE_URI}/youtube/streams/followed`, {
            json: {
                userId
            }
        });
        return body;
    }

    static async getYoutubePastStreams({ userId, channelId }) {
        const body = await got.post(`${YOUTUBE_SERVICE_URI}/youtube/streams/vods`, {
            json: {
                userId,
                channelId
            }
        });
        return JSON.parse(body.body).data;
    }

    static async getYoutubeUserInfo({ userId }) {
        const body = await got.post(`${YOUTUBE_SERVICE_URI}/youtube/user`, {
            json: {
                userId
            }
        }).json();
        return body;
    }

    static async fetchYoutubeUserByUserId({ userId }) {
        const body = await got.get(`${YOUTUBE_SERVICE_URI}/youtube/${userId}`).json();
        return body;
    }

    static async getYoutubeVideosNoLogin() {
        const body = await got.get(`${YOUTUBE_SERVICE_URI}/youtube/streams/top`).json();
        return body;
    }

    static async deleteYoutubeSession({ userId }){
        const body = await got.delete(`${YOUTUBE_SERVICE_URI}/youtube/${userId}`).json();
        return body;
    }

}