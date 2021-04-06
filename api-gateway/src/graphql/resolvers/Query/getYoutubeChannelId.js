import YoutubeService from "#root/adapters/YoutubeService";

const getYoutubeChannelIdResolver = async (obj, { userId, videoId }, context) => {
    const body = await YoutubeService.getYoutubeChannelId({ userId, videoId });
    return body;
};

export default getYoutubeChannelIdResolver;