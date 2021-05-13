import YoutubeService from "#root/adapters/YoutubeService";

const getYoutubeVodsResolver = async (obj, { channelId }, context) => {
    const body = await YoutubeService.getYoutubeVods({ channelId });
    return body;
};

export default getYoutubeVodsResolver;