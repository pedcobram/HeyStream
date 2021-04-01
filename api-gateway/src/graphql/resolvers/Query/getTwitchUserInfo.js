import TwitchService from "#root/adapters/TwitchService";

const getTwitchUserInfoResolver = async (obj, { userId }, context) => {
    const body = await TwitchService.getTwitchUserInfo({ userId });
    return body
};

export default getTwitchUserInfoResolver; 