import TwitchService from "#root/adapters/TwitchService";

const twitchLandingResolver = async (obj, { code, userId }, context) => {
  const land = await TwitchService.TwitchLinkAccountLanding({ code, userId });

  context.res.cookie("twitchAccessToken", JSON.parse(land.body).body.access_token, { httpOnly: false });

  return true;
};

export default twitchLandingResolver;