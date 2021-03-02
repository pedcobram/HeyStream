import { YouTube } from "#root/db/models";

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