import TwitchService from "#root/adapters/TwitchService";

const getTwitchVodsResolver = async (obj, { loginName }, context) => {
    const body = await TwitchService.getTwitchVods({ loginName });
    return body.vods;
};

export default getTwitchVodsResolver;