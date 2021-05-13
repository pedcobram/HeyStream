import YoutubeService from "#root/adapters/YoutubeService";

const getYoutubeChannelIdResolver = async (obj, { videoId }, context) => {
    const body = await YoutubeService.getYoutubeChannelId({ videoId });
    return body;
};

export default getYoutubeChannelIdResolver;