import YoutubeService from "#root/adapters/YoutubeService";

const getYoutubeVodsResolver = async (obj, { userId, channelId }, context) => {
    const body = await YoutubeService.getYoutubePastStreams({ userId, channelId });
    return body;
};

export default getYoutubeVodsResolver;