import TwitchService from "#root/adapters/TwitchService";

const deleteTwitchSessionResolver = async (obj, { userId }, context) => {
  await TwitchService.deleteTwitchSession({ userId });

  context.res.clearCookie("twitchAccessToken");

  return true;
};

export default deleteTwitchSessionResolver;