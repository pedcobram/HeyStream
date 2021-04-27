import TwitchService from "#root/adapters/TwitchService";

const getTwitchStreamClipsResolver = async (obj, { userId, videoId }, context) => {
    const body = await TwitchService.getTwitchStreamClips({ userId, videoId });
    
    return JSON.parse(body.body).data;
};

export default getTwitchStreamClipsResolver; 