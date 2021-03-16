import TwitchService from "#root/adapters/TwitchService";

const getTwitchVideosNoLoginResolver = async () => {
    const body = await TwitchService.getTwitchVideosNoLogin()
    return body.data;
};

export default getTwitchVideosNoLoginResolver;