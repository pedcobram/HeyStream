import { Twitch, User, TwitchChat } from "#root/db/models";
import got from "got";

import accessEnv from "#root/helpers/accessEnv"
import generateUUID from "#root/helpers/generateUUID";
import checkChannelLive from "#root/helpers/checkChannelLive";
import parseFollowedChannelsPage from "#root/helpers/parseFollowedChannelsPage";

const TWITCH_CLIENT_ID = accessEnv("TWITCH_CLIENT_ID", "lssv1zkc8pk1cvuo7tbdq3j0gtbxdr");
const REDIRECT_URI = accessEnv("REDIRECT_URI", "http://localhost:7001");
const REDIRECT_URI_LANDING = accessEnv("REDIRECT_URI", "http://localhost:7001/twitch/landing");
const TWITCH_CLIENT_SECRET = accessEnv("TWITCH_CLIENT_SECRET", "ebn5zvav8txjcujnrfphv8k9fy9hme");

const TWITCH_CLIENT_ID1 = accessEnv("TWITCH_CLIENT_ID", "ne4n4c0oenxn6zgq2ky3vtvvfowe1b");
const TWITCH_CLIENT_SECRET1 = accessEnv("TWITCH_CLIENT_SECRET", "1sl2kh3zcyag3k700u8q0wctlw9v0i");

const setupRoutes = app => {

  app.post("/twitch/search", async (req, res, next) => {
    try {
      
      const twitchAdmin = await User.findOne({ attributes: {}, where: {
        email: 'admin@heystream.com'}});

      const twitchSession = await Twitch.findOne({ attributes: {}, where: {
        userId: twitchAdmin.dataValues.id}});

      const response = await got.get('https://api.twitch.tv/helix/search/channels' 
      + '?query=' + req.body.query, {
        headers: {
          'Authorization': 'Bearer ' + twitchSession.access_token,
          'Client-Id': TWITCH_CLIENT_ID
      }});

      const r = JSON.parse(response.body).data;

      return res.json({
        "data": r 
      });
    } catch (error) {
      return next(error);
    }
  });

  // Get Twitch video info from videoId
  app.post("/twitch/video/videoId", async (req, res, next) => {
    try {

      const twitchAdmin = await User.findOne({ attributes: {}, where: {
        email: 'admin@heystream.com'}});

      const twitchSession = await Twitch.findOne({ attributes: {}, where: {
        userId: twitchAdmin.dataValues.id}});


      const response = await got.get('https://api.twitch.tv/helix/videos'
      + '?id=' + req.body.videoId, {
        headers: {
          'Authorization': 'Bearer ' + twitchSession.dataValues.access_token,
          'Client-Id': TWITCH_CLIENT_ID
      }}); 

      return res.json(JSON.parse(response.body));
    } catch (e)  {
      return next(e); 
    }
  });

  // Get Twitch clips that are somewhat interesting from the videoId given
  app.post("/twitch/vod/clips", async (req, res, next) => {

    const twitchChat = await TwitchChat.findOne({ attributes: {}, where: {
      videoId: req.body.videoId}});

    if (twitchChat) return res.json({
      "data": twitchChat.chat
    });

    try {
      var data = [];
      var game_cache = {};
      var pagination = "";
      
      const twitchUser = await Twitch.findOne({ attributes: {}, where: {
        userId: req.body.userId}});
        
      const video = await got.get('https://api.twitch.tv/helix/videos?id=' + req.body.videoId, {
      headers: {
        'Authorization': 'Bearer ' + twitchUser.access_token,
        'Client-Id': TWITCH_CLIENT_ID
      }});

      const vid_user_id = JSON.parse(video.body).data[0].user_id;
      const video_created_at = new Date(JSON.parse(video.body).data[0].created_at);
      const video_duration = JSON.parse(video.body).data[0].duration;
      const date = video_duration.split(/([0-9]+)/);

      var video_ended_at = new Date(video_created_at)
      video_ended_at.setHours(video_ended_at.getHours() + parseInt(date[1]), video_ended_at.getMinutes() + parseInt(date[3]), video_ended_at.getSeconds() + parseInt(date[5]));

      const clips = await got.get('https://api.twitch.tv/helix/clips?broadcaster_id=' + vid_user_id + '&started_at=' + video_created_at.toISOString() + '&ended_at=' + video_ended_at.toISOString(), {
      headers: {
        'Authorization': 'Bearer ' + twitchUser.access_token,
        'Client-Id': TWITCH_CLIENT_ID
      }});

      var j = 0;
      parseClip: while (j < 10) {
        const clip = JSON.parse(clips.body).data[j];
        const clip_date = clip.created_at;
        const clip_duration = clip.duration;
        
        const offset = (new Date(clip_date) - new Date(video_created_at))/1000 - Math.floor(clip_duration);
        const vod_timestamp_date = new Date((offset * 1000) - 30*1000) //- 60*1000 
        const vod_timestamp = vod_timestamp_date.getHours() + "h" + vod_timestamp_date.getMinutes() + "m" + vod_timestamp_date.getSeconds() + "s";

        var i = 0;
        var impressions = 0;
        var msgs = 0;
        while(i < 10) {
          try {
            const clip_chat = await got.get('https://api.twitch.tv/v5/videos/' + req.body.videoId + '/comments'
            + '?content_offset_seconds=' + offset
            + '&cursor=' + pagination, {
            headers: {
              'Authorization': 'Bearer ' + twitchUser.access_token,
              'Client-Id': TWITCH_CLIENT_ID
            }});

            const chat = JSON.parse(clip_chat.body);
            pagination = chat._next;
  
            for (const item of chat.comments) {
              var n = item.message.body.search(/(ha)+|l(ol)+|(jaj)+|(pog)+|(kekw)+|(xd+)|lul|(ja)+/i);

              if(n != -1) impressions++
              msgs++;

            };
            i++;
          } catch (error) {
            j++;
            break parseClip;
          }
        }
        if(impressions/msgs*100 > 15) {
          var game = "";
          if (clip.game_id in game_cache) {
            game = game_cache[clip.game_id]
          } else {
            const game_name = await got.get('https://api.twitch.tv/helix/games'
              + '?id=' + clip.game_id, {
              headers: {
                'Authorization': 'Bearer ' + twitchUser.access_token,
                'Client-Id': TWITCH_CLIENT_ID
            }});

            game_cache[clip.game_id] = JSON.parse(game_name.body).data[0].name;
            game = game_cache[clip.game_id];
          }

          data.push({
            "url": clip.url, 
            "title": clip.title,
            "vod_timestamp": vod_timestamp,
            "game": game,
            "totalMsgs": msgs,
            "impressions": impressions,
            "percentaje": impressions/msgs*100
          });
        }
        j++;
      };

      await TwitchChat.findOrCreate({
        where: {
          videoId: req.body.videoId,
        },
        defaults: {
          id: generateUUID(),
          chat: JSON.stringify(data)
        }    
      });

      return res.json({
        data
      });
    } catch (e) {
      return next(e);
    }
  });

  //Returns a list of vods (videos on demand) from the given streamer
  app.post("/twitch/streams/vods", async (req, res, next) => {
    try {

      const twitchAdmin = await User.findOne({ attributes: {}, where: {
        email: 'admin@heystream.com'}});

      const twitchSession = await Twitch.findOne({ attributes: {}, where: {
        userId: twitchAdmin.dataValues.id}});

      const response1 = await got.get('https://api.twitch.tv/helix/users'
      + '?login=' + req.body.loginName, {
        headers: {
          'Authorization': 'Bearer ' + twitchSession.dataValues.access_token,
          'Client-Id': TWITCH_CLIENT_ID
      }}); 

      const streamerId = JSON.parse(response1.body).data[0].id;

      const response2 = await got.get('https://api.twitch.tv/helix/videos'
      + '?user_id=' + streamerId
      + '&first=50'
      + '&period=all'
      + '&type=archive', {
        headers: {
          'Authorization': 'Bearer ' + twitchSession.dataValues.access_token,
          'Client-Id': TWITCH_CLIENT_ID
      }});

      return res.json({
        vods: JSON.parse(response2.body)
      })
    } catch (e) {
      return next(e);
    }
   });

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