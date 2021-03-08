import TwitchService from "#root/adapters/TwitchService";

const getTwitchLinkAccount = async () => {
    const body = await TwitchService.TwitchLinkAccount();
    return body.body;
};

export default getTwitchLinkAccount;