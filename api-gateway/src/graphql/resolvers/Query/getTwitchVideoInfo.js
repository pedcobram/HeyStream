import TwitchService from "#root/adapters/TwitchService";

const getTwitchVideoInfoResolver = async (obj, { videoId }, context) => {
    const body = await TwitchService.getTwitchVideoInfo({ videoId });
    
    return JSON.parse(body.body).data[0];
};

export default getTwitchVideoInfoResolver; 