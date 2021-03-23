import TwitchService from "#root/adapters/TwitchService";

const getTwitchStreamResolver = async (obj, { userId, twitchUserId }, context) => {
    const body = await TwitchService.getTwitchStream({ userId, twitchUserId });

    //if empty (Twitch streamer offline) return null
    if(JSON.parse(body.body).data.length == 0) {
        return null;
    }

    return JSON.parse(body.body).data;
};

export default getTwitchStreamResolver; 