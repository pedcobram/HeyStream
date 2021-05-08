import TwitchService from "#root/adapters/TwitchService";

const getTwitchVideoInfoResolver = async (obj, { userId, videoId }, context) => {
    const body = await TwitchService.getTwitchVideoInfo({ userId, videoId });
    
    return JSON.parse(body.body).data[0];
};

export default getTwitchVideoInfoResolver; 