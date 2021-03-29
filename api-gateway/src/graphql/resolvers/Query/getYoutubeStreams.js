import YoutubeService from "#root/adapters/YoutubeService";

const getYoutubeStreamsResolver = async (obj, { userId, pageToken }, context) => {
    const body = await YoutubeService.getYoutubeStream({ userId, pageToken });

    return JSON.parse(body.body);
};

export default getYoutubeStreamsResolver; 