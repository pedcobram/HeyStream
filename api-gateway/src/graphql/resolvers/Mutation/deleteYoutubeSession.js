import YoutubeService from "#root/adapters/YoutubeService";

const deleteYoutubeSessionResolver = async (obj, { userId }, context) => {
  await YoutubeService.deleteYoutubeSession({ userId });

  context.res.clearCookie("youtubeAccessToken");

  return true;
};

export default deleteYoutubeSessionResolver;