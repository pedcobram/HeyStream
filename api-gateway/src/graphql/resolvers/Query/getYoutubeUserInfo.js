import YoutubeService from "#root/adapters/YoutubeService";

const getYoutubeUserInfoResolver = async (obj, { userId }, context) => {
    return await YoutubeService.getYoutubeUserInfo({ userId });
};

export default getYoutubeUserInfoResolver; 