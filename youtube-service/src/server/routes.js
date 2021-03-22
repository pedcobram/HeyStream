import got from "got";

import { User, YouTube } from "#root/db/models";

import accessEnv from "#root/helpers/accessEnv"
import generateUUID from "#root/helpers/generateUUID";

const YOUTUBE_CLIENT_ID = accessEnv("YOUTUBE_CLIENT_ID", "172700488858-a6npf1l2m815lppv6oc7cunah030mccg.apps.googleusercontent.com");
const YOUTUBE_CLIENT_SECRET = accessEnv("YOUTUBE_CLIENT_SECRET", "AJoceRJtOCHqXs3XNo74owZJ");
const REDIRECT_URI = accessEnv("REDIRECT_URI", "http://localhost:7001");
const REDIRECT_URI_LANDING = accessEnv("REDIRECT_URI", "http://localhost:7001/youtube/landing");

const setupRoutes = app => {

  app.get("/youtube/link", async (req, res, next) => {
    try {

      const uri = 'https://accounts.google.com/o/oauth2/auth'
      + '?client_id=' + YOUTUBE_CLIENT_ID 
      + '&redirect_uri=' + REDIRECT_URI_LANDING
      + '&scope=https://www.googleapis.com/auth/youtube.readonly'
      + '&response_type=code'
      + '&access_type=offline'

      return res.json(uri)

    } catch (e) {
      return next(e);
    }
  });

  app.post("/youtube/link", async (req, res, next) => {
    try {

      if(!req.body.code || !req.body.userId) {
        return next(new Error("Incorrect parameters !!"))
      }

      const response = await got.post('https://accounts.google.com/o/oauth2/token', {
        headers: {
          Host: 'accounts.google.com',
          userKey: 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
          code: req.body.code,
          client_id: YOUTUBE_CLIENT_ID,
          client_secret: YOUTUBE_CLIENT_SECRET,
          redirect_uri: REDIRECT_URI_LANDING,
          grant_type: "authorization_code"
        })
        }
      );    

      const user = await got.get("http://users-service:7101/sessions/" + req.body.userId);

      const data = JSON.parse(response.body);

      const created = await YouTube.create({
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

  app.get("/youtube/videos", async (req, res, next) => {
    try {
      
      const youtubeAdmin = await User.findOne({ attributes: {}, where: {
        email: 'admin@heystream.com'}});

      const youtubeSession = await YouTube.findOne({ attributes: {}, where: {
        userId: youtubeAdmin.dataValues.id}});

      const response = await got.get('https://www.googleapis.com/youtube/v3/search'
      + '?part=snippet'
      + '&eventType=live'
      + '&type=video'
      + '&videoCategoryId=2'
      + '0&maxResults=10', 
      {
        headers: {
          'Authorization': 'Bearer ' + youtubeSession.dataValues.access_token
      }});  

      return res.json(JSON.parse(response.body));
    } catch (e) {
      return next(e);
    }
  });

  app.post("/youtube/refreshToken", async (req, res, next) => {
    try {
      
      const yt = await YouTube.findOne({ attributes: {}, where: {
        userId: req.body.userId}});

      if (!yt) return await next(new Error("No data for this user ID!"));

      const response = await got.post('https://www.googleapis.com/o/oauth2/token'
          + '?client_id=' + YOUTUBE_CLIENT_ID
          + '&client_secret=' + YOUTUBE_CLIENT_SECRET
          + '&refresh_token=' + yt.dataValues.refresh_token
          + '&grant_type=refresh_token',{ 
          headers: {
            Host: 'accounts.google.com',
            ContentType: 'application/x-www-form-urlencoded'
          }
        }
      );

      const parsed_response = JSON.parse(response.body);

      yt.access_token = parsed_response.access_token;

      await yt.save();

      return res.json({
        message: "Youtube token updated correctly!"
      });
    } catch (e) {
      return next(e);
    }
  });

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

  app.delete("/youtube/:userId", async (req, res, next) => {
    try {
      
      const ytUser = await YouTube.findOne({ attributes: {}, where: {
        userId: req.params.userId}});

      await ytUser.destroy();

      return res.end();
    } catch (e) {
      return next(e);
    }
  });
}


export default setupRoutes;