import YoutubeService from "#root/adapters/YoutubeService";

const getFollowedYoutubeUsersResolver = async (obj, { userId }, context) => {
  const body = await YoutubeService.getFollowedYoutubeUsers({ userId });

  return JSON.parse(body.body);
};

export default getFollowedYoutubeUsersResolver;