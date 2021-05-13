import YoutubeService from "#root/adapters/YoutubeService";

const getYoutubeVideoInfoResolver = async (obj, { videoId }, context) => {
  const body = await YoutubeService.getYoutubeVideoInfo({ videoId });

  return body.data;
};

export default getYoutubeVideoInfoResolver;