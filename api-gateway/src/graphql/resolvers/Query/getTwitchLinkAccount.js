import TwitchService from "#root/adapters/TwitchService";

const getTwitchLinkAccount = async () => {
    await TwitchService.TwitchLinkAccount();
    return true;
};

export default getTwitchLinkAccount;