import YoutubeService from "#root/adapters/YoutubeService";

const getYoutubeQueryResolver = async (obj, { query }, context) => {
  const body = await YoutubeService.getYoutubeQuery({ query });

  return body;
};

export default getYoutubeQueryResolver;