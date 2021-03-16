import { Twitch, User } from "#root/db/models";
import got from "got";

import accessEnv from "#root/helpers/accessEnv"
import generateUUID from "#root/helpers/generateUUID";

const TWITCH_CLIENT_ID = accessEnv("TWITCH_CLIENT_ID", "lssv1zkc8pk1cvuo7tbdq3j0gtbxdr");
const REDIRECT_URI = accessEnv("REDIRECT_URI", "http://localhost:7001");
const REDIRECT_URI_LANDING = accessEnv("REDIRECT_URI", "http://localhost:7001/twitch/landing");
const TWITCH_CLIENT_SECRET = accessEnv("TWITCH_CLIENT_SECRET", "ebn5zvav8txjcujnrfphv8k9fy9hme");

const setupRoutes = app => {

  app.get("/twitch/link", async (req, res, next) => {
    try {

      const uri = 'https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=' + TWITCH_CLIENT_ID 
      + '&redirect_uri=' + REDIRECT_URI_LANDING 
      + '&state=' + TWITCH_CLIENT_SECRET
      + 'scopes=user_read';

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

  app.get("/twitch/videos", async (req, res, next) => {
    try {
      
      const twitchAdmin = await User.findOne({ attributes: {}, where: {
        email: 'admin@heystream.com'}});

      const twitchSession = await Twitch.findOne({ attributes: {}, where: {
        userId: twitchAdmin.dataValues.id}});

      var httpheaders = {
        Authorization: 'Bearer ' + twitchSession.dataValues.access_token,
        ClientId: TWITCH_CLIENT_ID
      }

      const response = await got.get('https://api.twitch.tv/helix/streams?first=25', {
        headers: {
          'Authorization': 'Bearer ' + twitchSession.dataValues.access_token,
          'Client-Id': TWITCH_CLIENT_ID
      }});  

      return res.json(JSON.parse(response.body));
    } catch (e) {
      return next(e);
    }
  });

  app.get("/twitch/:userId", async (req, res, next) => {
    try {
      
      const twitchUser = await Twitch.findOne({ attributes: {}, where: {
        userId: req.params.userId}});

      return res.json(twitchUser);
    } catch (e) {
      return next(e);
    }
  });

  
  app.post("/twitch/appToken", async (req, res, next) => {
    try {

      const response = await got.post('https://id.twitch.tv/oauth2/token'
      + '?client_id=' + TWITCH_CLIENT_ID 
      + '&client_secret=' + TWITCH_CLIENT_SECRET 
      + '&grant_type=client_credentials');

      const data = JSON.parse(response.body);

      const twitchAdmin = await User.findOne({ attributes: {}, where: {
        email: 'admin@heystream.com'}});

      const twitchSession = await Twitch.findOne({ attributes: {}, where: {
        userId: twitchAdmin.dataValues.id}});

      if (twitchSession) {
        await Twitch.update(
          {
            access_token: data.access_token,
            refresh_token: null       
          },
          {
            where: {
              userId: twitchAdmin.dataValues.id
            }
          }
        )
      } else {
          await Twitch.create({
          userId: twitchAdmin.dataValues.id,
          id: generateUUID(),
          access_token: data.access_token,
          refresh_token: null        
        })
      }

      return res.json({
        message: "Everything went Ok !"
      });
    } catch (e) {
      return next(e);
    }
  });

  app.post("/twitch/link", async (req, res, next) => {
    try {

      if(!req.body.code || !req.body.userId) {
        return next(new Error("Incorrect parameters !!"))
      }

      const response = await got.post('https://id.twitch.tv/oauth2/token'
      + '?client_id=' + TWITCH_CLIENT_ID 
      + '&client_secret=' + TWITCH_CLIENT_SECRET 
      + '&code=' + req.body.code
      + '&grant_type=authorization_code'
      + '&redirect_uri=' + REDIRECT_URI);    

      const user = await got.get("http://users-service:7101/sessions/" + req.body.userId);

      const data = JSON.parse(response.body);

      const created = await Twitch.create({
        id: generateUUID(),
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        userId: JSON.parse(user.body).userId
      })

      return res.json({
        message: "Everything went Ok !",
        body: created
      });
    } catch (e) {
      return next(e);
    }
  });

  app.delete("/twitch/:userId", async (req, res, next) => {
    try {
      
      const twitchUser = await Twitch.findOne({ attributes: {}, where: {
        userId: req.params.userId}});

      await twitchUser.destroy();

      return res.end();
    } catch (e) {
      return next(e);
    }
  });

}

export default setupRoutes;