import TwitchService from "#root/adapters/TwitchService";

const getTwitchUser = async (obj, { id }, context) => {
    return await TwitchService.fetchTwitchUser({id});
};

export default getTwitchUser; 