import YoutubeService from "#root/adapters/YoutubeService";

const getYoutubeLinkAccountResolver = async () => {
    const body = await YoutubeService.YoutubeLinkAccount();
    return body.body;
};

export default getYoutubeLinkAccountResolver;