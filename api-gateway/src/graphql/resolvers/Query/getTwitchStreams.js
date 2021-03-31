import TwitchService from "#root/adapters/TwitchService";

const getTwitchStreamsResolver = async (obj, { userId }, context) => {
    const body = await TwitchService.getTwitchStreams({ userId });
    
    return JSON.parse(body.body).response;
};

export default getTwitchStreamsResolver; 