import { Twitch } from "#root/db/models";

import accessEnv from "#root/helpers/accessEnv"

const TWITCH_CLIENT_ID = accessEnv("TWITCH_CLIENT_ID", "lssv1zkc8pk1cvuo7tbdq3j0gtbxdr");
const REDIRECT_URI = accessEnv("REDIRECT_URI", "http://localhost:7001");
const REDIRECT_URI_LANDING = accessEnv("REDIRECT_URI", "http://localhost:7001/twitch/landing");
const TWITCH_CLIENT_SECRET = accessEnv("TWITCH_CLIENT_SECRET", "ebn5zvav8txjcujnrfphv8k9fy9hme");

const setupRoutes = app => {

  app.get("/twitch/link", async (req, res, next) => {
    try {
      res.redirect('https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=' + TWITCH_CLIENT_ID 
            + '&redirect_uri=' + REDIRECT_URI_LANDING 
            + '&state=' + TWITCH_CLIENT_SECRET
            + 'scopes=user:edit user:edit')

      const uri = 'https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=' + TWITCH_CLIENT_ID 
      + '&redirect_uri=' + REDIRECT_URI_LANDING 
      + '&state=' + TWITCH_CLIENT_SECRET
      + 'scopes=user:edit user:edit';

      return res.json(uri)

    } catch (e) {
      return next(e);
    }
  });

  app.get("/twitch", async (req, res, next) => {
    try {

      const twitchUsers = await Twitch.findAll();
      return res.json(twitchUsers)

    } catch (e) {
      return next(e);
    }
  })
  
  app.get("/twitch/:userId", async (req, res, next) => {
    try {
      
      const yt = await Twitch.findOne({ attributes: {}, where: {
        id: req.params.userId}});

      if (!yt) return await next(new Error("No data for this user ID!"));

      return res.json(yt);
    } catch (e) {
      return next(e);
    }
  });

}

export default setupRoutes;