import TwitchService from "#root/adapters/TwitchService";

const getFollowedTwitchUsersResolver = async (obj, { userId }, context) => {
  const body = await TwitchService.getFollowedTwitchUsers({ userId });

  return JSON.parse(body.body);
};

export default getFollowedTwitchUsersResolver;