import YoutubeService from "#root/adapters/YoutubeService";

const getYoutubeVideoInfoResolver = async (obj, { userId, videoId }, context) => {
  const body = await YoutubeService.getYoutubeVideoInfo({ userId, videoId });

  return body.data;
};

export default getYoutubeVideoInfoResolver;