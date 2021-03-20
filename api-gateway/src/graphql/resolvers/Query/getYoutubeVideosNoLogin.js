import YoutubeService from "#root/adapters/YoutubeService";

const getYoutubeVideosNoLoginResolver = async () => {
    const body = await YoutubeService.getYoutubeVideosNoLogin();
    return body;
};

export default getYoutubeVideosNoLoginResolver;