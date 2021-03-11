import got from "got";

import { YouTube } from "#root/db/models";

import accessEnv from "#root/helpers/accessEnv"
import generateUUID from "#root/helpers/generateUUID";

const YOUTUBE_CLIENT_ID = accessEnv("YOUTUBE_CLIENT_ID", "247824550638-k1e8mq2lj47cbr0v0pf41c8khj17qo4h.apps.googleusercontent.com");
const YOUTUBE_CLIENT_SECRET = accessEnv("YOUTUBE_CLIENT_SECRET", "cphCSSPyRaJyMIyffQ4C080u");
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

      var httpHeaders = {
        'Host': 'accounts.google.com',
        'user-key': 'application/x-www-form-urlencoded'
      }

      const postData = {
        code: req.body.code,
        client_id: YOUTUBE_CLIENT_ID,
        client_secret: YOUTUBE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI_LANDING,
        grant_type: "authorization_code"
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