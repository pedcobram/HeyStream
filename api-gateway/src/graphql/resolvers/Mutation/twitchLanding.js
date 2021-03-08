import TwitchService from "#root/adapters/TwitchService";

const twitchLandingResolver = async (obj, { code, userId }, context) => {
  await TwitchService.TwitchLinkAccountLanding({ code, userId });

  return true;
};

export default twitchLandingResolver;