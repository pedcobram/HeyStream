import TwitchService from "#root/adapters/TwitchService";

const getAllTwitchUsers = async () => {
    return await TwitchService.getAllTwitchUsers();
};

export default getAllTwitchUsers;