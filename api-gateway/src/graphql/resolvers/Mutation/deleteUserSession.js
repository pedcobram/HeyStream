import UsersService from "#root/adapters/UsersService";

const deleteUserSessionResolver = async (obj, { sessionId }, context) => {
  await UsersService.deleteUserSession({ sessionId });

  context.res.clearCookie("userSessionId");
  context.res.clearCookie("userId");
  context.res.clearCookie("twitchAccessToken");
  context.res.clearCookie("youtubeAccessToken");

  return true;
};

export default deleteUserSessionResolver;