import YoutubeService from "#root/adapters/YoutubeService";

const youtubeLandingResolver = async (obj, { code, userId }, context) => {
  const land = await YoutubeService.YoutubeLinkAccountLanding({ code, userId });

  context.res.cookie("youtubeAccessToken", JSON.parse(land.body).body.access_token, { httpOnly: false });

  return true;
};

export default youtubeLandingResolver;