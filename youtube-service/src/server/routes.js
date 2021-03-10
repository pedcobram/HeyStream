import { YouTube } from "#root/db/models";

const YOUTUBE_CLIENT_ID = accessEnv("YOUTUBE_CLIENT_ID", "247824550638-k1e8mq2lj47cbr0v0pf41c8khj17qo4h.apps.googleusercontent.com");
const YOUTUBE_CLIENT_SECRET = accessEnv("YOUTUBE_CLIENT_SECRET", "cphCSSPyRaJyMIyffQ4C080u");
const REDIRECT_URI = accessEnv("REDIRECT_URI", "http://localhost:7001");
const REDIRECT_URI_LANDING = accessEnv("REDIRECT_URI", "http://localhost:7001/youtube/landing");

const setupRoutes = app => {

  app.get("/youtube/:userId", async (req, res, next) => {
    try {
      const yt = await YouTube.findOne({ attributes: {}, where: {
        userId: req.params.userId}});

      if (!yt) return await next(new Error("No data for this user ID!"));

      return res.json(yt);
    } catch (e) {
      return next(e);
    }
  });
}

export default setupRoutes;