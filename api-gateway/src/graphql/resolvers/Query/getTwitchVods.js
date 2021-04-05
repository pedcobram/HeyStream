import TwitchService from "#root/adapters/TwitchService";

const getTwitchVodsResolver = async (obj, { userId, loginName }, context) => {
    const body = await TwitchService.getTwitchVods({ userId, loginName });
    return body.vods;
};

export default getTwitchVodsResolver;