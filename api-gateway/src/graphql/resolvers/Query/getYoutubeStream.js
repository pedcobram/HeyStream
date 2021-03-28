import YoutubeService from "#root/adapters/YoutubeService";

const getYoutubeStreamResolver = async (obj, { userId, channelId }, context) => {
    const body = await YoutubeService.getYoutubeStream({ userId, channelId });

    //if empty (Twitch streamer offline) return null
    if(JSON.parse(body.body).data.length == 0) {
        return null;
    }

    console.log(JSON.parse(body))
    return JSON.parse(body.body).data;
};

export default getYoutubeStreamResolver; 