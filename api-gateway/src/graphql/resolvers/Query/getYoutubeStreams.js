import YoutubeService from "#root/adapters/YoutubeService";

const getYoutubeStreamsResolver = async (obj, { userId }, context) => {
    const body = await YoutubeService.getYoutubeStreams({ userId });
    return JSON.parse(body.body);
};

export default getYoutubeStreamsResolver; 