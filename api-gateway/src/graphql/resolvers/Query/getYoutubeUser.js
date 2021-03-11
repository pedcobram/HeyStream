import YoutubeService from "#root/adapters/YoutubeService";

const getYoutubeUserResolver = async (obj, { userId }, context) => {
    return await YoutubeService.fetchYoutubeUserByUserId({ userId });
};

export default getYoutubeUserResolver; 