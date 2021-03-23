import UsersService from "#root/adapters/UsersService";
import TwitchService from "#root/adapters/TwitchService";
import YoutubeService from "#root/adapters/YoutubeService";

const createUserSessionResolver = async (obj, { email, password }, context) => {
  const userSession = await UsersService.createUserSession({ email, password });

  const userId = userSession.userId

  context.res.cookie("userSessionId", userSession.id, { httpOnly: false });
  context.res.cookie("userId", userId, { httpOnly: false });

  const twitchSession = await TwitchService.fetchTwitchUserByUserId({ userId })

  if (twitchSession != null) {
    context.res.cookie("twitchAccessToken", twitchSession.access_token, { httpOnly: false });
  }  

  const ytSession = await YoutubeService.fetchYoutubeUserByUserId({ userId })

  if (ytSession != null) {
    context.res.cookie("youtubeAccessToken", ytSession.access_token, { httpOnly: false });
  }  

  return userSession;
};

export default createUserSessionResolver;