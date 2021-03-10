import TwitchService from "#root/adapters/TwitchService";

const getTwitchUser = async (obj, { userId }, context) => {
    return await TwitchService.fetchTwitchUserByUserId({ userId });
};

export default getTwitchUser; 