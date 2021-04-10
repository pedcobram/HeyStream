import { Twitch, User, TwitchChat } from "#root/db/models";
import got from "got";

import accessEnv from "#root/helpers/accessEnv"
import generateUUID from "#root/helpers/generateUUID";
import checkChannelLive from "#root/helpers/checkChannelLive";
import parseFollowedChannelsPage from "#root/helpers/parseFollowedChannelsPage";

const TWITCH_CLIENT_ID2 = accessEnv("TWITCH_CLIENT_ID", "lssv1zkc8pk1cvuo7tbdq3j0gtbxdr");
const REDIRECT_URI = accessEnv("REDIRECT_URI", "http://localhost:7001");
const REDIRECT_URI_LANDING = accessEnv("REDIRECT_URI", "http://localhost:7001/twitch/landing");
const TWITCH_CLIENT_SECRET2 = accessEnv("TWITCH_CLIENT_SECRET", "ebn5zvav8txjcujnrfphv8k9fy9hme");

const TWITCH_CLIENT_ID = accessEnv("TWITCH_CLIENT_ID", "ne4n4c0oenxn6zgq2ky3vtvvfowe1b");
const TWITCH_CLIENT_SECRET = accessEnv("TWITCH_CLIENT_SECRET", "1sl2kh3zcyag3k700u8q0wctlw9v0i");

const parseChat = async (videoId, access_token, cursor) => {
  const Null = null;
  if (cursor == null) return {Null, Null};

  const response = await got.get('https://api.twitch.tv/v5/videos/' + videoId + '/comments'
  + '?cursor=' + cursor
  + '&limit=100', {
        headers: {
          'Authorization': 'Bearer ' + access_token,
          'Client-Id': TWITCH_CLIENT_ID
      }});

  const body = JSON.parse(response.body);

  var cursor = body._next === undefined ? null : body._next

  var resArray = []
  for (const item of body.comments) {
    resArray.push({
      "timestamp": item.created_at, 
      "username": item.commenter.name, 
      "message": item.message.body})
  }

  return {resArray, cursor};
};

const setupRoutes = app => {
  // Test route for deployment
  app.get("/twitch/hello", async (req, res, next) => {
   return res.json({
     hello: "Hello :)"
   }) 
  });

  app.post("/twitch/vod/chat", async (req, res, next) => {
    try {

      var array = [];
      var pagination = "";

      const twitchUser = await Twitch.findOne({ attributes: {}, where: {
        userId: req.body.userId}});

      var i = 0
      while(i < 200) {
        const {resArray, cursor} = await parseChat(req.body.videoId, twitchUser.access_token, pagination);
        pagination = cursor
        array.push(resArray)
        i++
      }

      var responseArray = [].concat.apply([], array);

      const twc = await TwitchChat.findOrCreate({
        where: {
          videoId: req.body.videoId,
        },
        defaults: {
          id: generateUUID(),
          chat: JSON.stringify(responseArray)
        }    
      })
      
      return res.json({
        "data": twc
      });
    } catch (e) {
      return next(e);
    }
   });

  //
  app.post("/twitch/vod/chat/pagination", async (req, res, next) => {
    try {
      var array = [];
      var pagination = "";
      
      const twitchUser = await Twitch.findOne({ attributes: {}, where: {
        userId: req.body.userId}});      
      
      var i = 0
      while(true) {
        const response = await got.get('https://api.twitch.tv/v5/videos/' + req.body.videoId + '/comments'
        + '?cursor=' + pagination, {
        headers: {
          'Authorization': 'Bearer ' + twitchUser.access_token,
          'Client-Id': TWITCH_CLIENT_ID
        }});

        array.push({ "cursor": pagination })
        pagination = JSON.parse(response.body)._next

        if(pagination == undefined || pagination == null) break;

        i++
        console.log(i)
      }

      var responseArray = [].concat.apply([], array);
      
      return res.json({
        "data": responseArray
      });
    } catch (e) {
      return next(e);
    }
  });

  //Returns a list of vods (videos on demand) from the given streamer
  app.post("/twitch/streams/vods", async (req, res, next) => {
    try {

      const twitchUser = await Twitch.findOne({ attributes: {}, where: {
        userId: req.body.userId}});

      const response1 = await got.get('https://api.twitch.tv/helix/users'
      + '?login=' + req.body.loginName, {
        headers: {
          'Authorization': 'Bearer ' + twitchUser.access_token,
          'Client-Id': TWITCH_CLIENT_ID
      }}); 

      const streamerId = JSON.parse(response1.body).data[0].id;

      const response2 = await got.get('https://api.twitch.tv/helix/videos'
      + '?user_id=' + streamerId
      + '&first=50'
      + '&period=all'
      + '&type=archive', {
        headers: {
          'Authorization': 'Bearer ' + twitchUser.access_token,
          'Client-Id': TWITCH_CLIENT_ID
      }});

      const vods = JSON.parse(response2.body)

      return res.json({
        vods 
      })
    } catch (e) {
      return next(e);
    }
   })

  //Get parsed list of live users from all the streamers the users follows
  app.post("/twitch/streams", async (req, res, next) => {
    try {

      const twitchUser = await Twitch.findOne({ attributes: {}, where: {
        userId: req.body.userId}});

      const response1 = await got.get('https://api.twitch.tv/helix/users', {
        headers: {
          'Authorization': 'Bearer ' + twitchUser.access_token,
          'Client-Id': TWITCH_CLIENT_ID
      }}); 

      const myChannelId = JSON.parse(response1.body).data[0].id

      const response2 = await got.get('https://api.twitch.tv/helix/users/follows'
      + '?from_id=' + myChannelId
      + '&first=50', {
        headers: {
          'Authorization': 'Bearer ' + twitchUser.access_token,
          'Client-Id': TWITCH_CLIENT_ID
      }});

      var channelArray2 = [];
      for(let b = 0; b < 5; b++) {
        var dirtyArray = [];
        for (let a = 0; a < 10; a++) {
          dirtyArray.push(JSON.parse(response2.body).data[a+10*b]?.to_login ? JSON.parse(response2.body).data[a+10*b].to_login : null);
        }
        channelArray2.push(dirtyArray);
      }

      var channelArray = [].concat.apply([], channelArray2);
      var responseArray = []

      await Promise.all([
        await checkChannelLive(channelArray.slice(0,25), twitchUser.access_token),
        await checkChannelLive(channelArray.slice(25,50), twitchUser.access_token),
      ]).then((values) => {
        for(let val of values) {
          if(val != null) {
            responseArray.push(val);
          }
        }
      });
      
      const totalResults = JSON.parse(response2.body).total;
      const resultsPerPage = 50;
      var pagination = typeof JSON.parse(response2.body).pagination.cursor == 'undefined' ? "" : JSON.parse(response2.body).pagination.cursor;

      var i = resultsPerPage;
      
      while(i < totalResults) {
        const {resPagination, array} = await parseFollowedChannelsPage(myChannelId, pagination, twitchUser.access_token);
        pagination = resPagination
        responseArray.push(array)
        i = i + resultsPerPage
      }
      
      var flattenedResponse = [].concat.apply([], responseArray);

      return res.json({
        response: flattenedResponse
      });
    } catch (e)  {
      return next(e);
    }
  });

  // Get the top streams on Twitch for the home page
  app.get("/twitch/videos", async (req, res, next) => {
    try {
      
      const twitchAdmin = await User.findOne({ attributes: {}, where: {
        email: 'admin@heystream.com'}});

      const twitchSession = await Twitch.findOne({ attributes: {}, where: {
        userId: twitchAdmin.dataValues.id}});

      const response = await got.get('https://api.twitch.tv/helix/streams?first=10', {
        headers: {
          'Authorization': 'Bearer ' + twitchSession.dataValues.access_token,
          'Client-Id': TWITCH_CLIENT_ID
      }});  

      return res.json(JSON.parse(response.body));
    } catch (e) {
      return next(e);
    }
  });

  // Get an App Token from Twitch
  app.get("/twitch/appToken", async (req, res, next) => {
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

  // Refresh the twitch access_token of an userId
  app.post("/twitch/refreshToken", async (req, res, next) => {
    try {

      const twitchUser = await Twitch.findOne({ attributes: {}, where: {
        userId: req.body.userId}});

      const response = await got.post('https://id.twitch.tv/oauth2/token'
      + '?grant_type=refresh_token'
      + '&refresh_token=' + twitchUser.dataValues.refresh_token
      + '&client_id=' + TWITCH_CLIENT_ID
      + '&client_secret=' + TWITCH_CLIENT_SECRET)

      const parsed_response = JSON.parse(response.body);

      twitchUser.access_token = parsed_response.access_token;

      await twitchUser.save();

      return res.json({
        message: "Twitch token updated correctly!"
      });
    } catch (e) {
      return next(e);
    }
  });

  // Get the URL to redirect an user to login to their Twitch Account
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

  // Process the code given by Twitch to obtain an access_token. Then store it on the DB
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

  // Get Twitch user by userId given in the POST body
  app.post("/twitch/user", async (req, res, next) => {
    try {

      const twitchUser = await Twitch.findOne({ attributes: {}, where: {
        userId: req.body.userId}});

      const response = await got.get('https://api.twitch.tv/helix/users', {
        headers: {
          'Authorization': 'Bearer ' + twitchUser.access_token,
          'Client-Id': TWITCH_CLIENT_ID
      }}); 

      return res.json(JSON.parse(response.body));
    } catch (e)  {
      return next(e); 
    }
  });

  // Get all Twitch data from all the users
  app.get("/twitch", async (req, res, next) => {
    try {

      const twitchUsers = await Twitch.findAll();
      return res.json(twitchUsers)

    } catch (e) {
      return next(e);
    }
  });

  // Get Twitch user by userId from our DB
  app.get("/twitch/:userId", async (req, res, next) => {
    try {
      
      const twitchUser = await Twitch.findOne({ attributes: {}, where: {
        userId: req.params.userId}});

      return res.json(twitchUser);
    } catch (e) {
      return next(e);
    }
  });

  // Delete Twitch user by userId from our DB
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