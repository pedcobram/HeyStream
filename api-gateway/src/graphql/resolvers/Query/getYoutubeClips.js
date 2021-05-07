import YoutubeService from "#root/adapters/YoutubeService";

const getYoutubeClipsResolver = async (obj, { userId, videoId, next }, context) => {
  const body = await YoutubeService.getYoutubeClips({ userId, videoId, next });

  return body;
};

export default getYoutubeClipsResolver;