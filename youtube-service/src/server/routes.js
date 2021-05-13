import got from "got";

import { User, YouTube, YoutubeChat } from "#root/db/models";

import accessEnv from "#root/helpers/accessEnv";
import generateUUID from "#root/helpers/generateUUID";
import checkChannelLive from "#root/helpers/checkChannelLive";
import parseFollowedChannelsPage from "#root/helpers/parseFollowedChannelsPage"

const YOUTUBE_CLIENT_ID1 = accessEnv("YOUTUBE_CLIENT_ID", "172700488858-a6npf1l2m815lppv6oc7cunah030mccg.apps.googleusercontent.com");
const YOUTUBE_CLIENT_SECRET1 = accessEnv("YOUTUBE_CLIENT_SECRET", "AJoceRJtOCHqXs3XNo74owZJ");
const REDIRECT_URI = accessEnv("REDIRECT_URI", "http://localhost:7001");
const REDIRECT_URI_LANDING1 = accessEnv("REDIRECT_URI", "http://localhost:7001/youtube/landing");

const YOUTUBE_CLIENT_ID2 = accessEnv("YOUTUBE_CLIENT_ID", "114734933279-i6im8fvce39v2ub9aj4h9igoj1rm448i.apps.googleusercontent.com");
const YOUTUBE_CLIENT_SECRET2 = accessEnv("YOUTUBE_CLIENT_SECRET", "H5Mlg7C8-R4ebHaa41HuuZ-k");
const REDIRECT_URI_LANDING2 = accessEnv("REDIRECT_URI", "http://localhost:7001/youtube/landing");

const YOUTUBE_CLIENT_ID = accessEnv("YOUTUBE_CLIENT_ID", "677542340493-s40cnjmjhqmmtbd2vqde1ulp2mn7csd5.apps.googleusercontent.com");
const YOUTUBE_CLIENT_SECRET = accessEnv("YOUTUBE_CLIENT_SECRET", "T6Ii6L_F4UVGYBAWwvmv_hgS");
const REDIRECT_URI_LANDING = accessEnv("REDIRECT_URI", "http://localhost:7001/youtube/landing");

const setupRoutes = app => {

  //Get channels by query
  app.post("/youtube/search", async (req, res, next) => {
    try {
      
      const youtubeAdmin = await User.findOne({ attributes: {}, where: {
        email: 'admin@heystream.com'}});

      const youtubeSession = await YouTube.findOne({ attributes: {}, where: {
        userId: youtubeAdmin.dataValues.id}});

      const response = await got.get('https://www.googleapis.com/youtube/v3/search'
      + '?part=snippet'
      + '&q=' + req.body.query
      + '&type=channel'
      + '&maxResults=20'
      + '&order=relevance', 
      {
        headers: {
          'Authorization': 'Bearer ' + youtubeSession.dataValues.access_token
      }});  

      var liveArray = [];
      
      for (let item of JSON.parse(response.body).items) {
        if (item.snippet.liveBroadcastContent == "live") {
          const liveResponse = await got.get('https://www.googleapis.com/youtube/v3/search'
            + '?part=snippet'
            + '&channelId=' + item.snippet.channelId
            + '&type=video'
            + '&eventType=live'
            + '&order=relevance', {
              headers: {
                'Authorization': 'Bearer ' + youtubeSession.dataValues.access_token,
              }
          });
          
          liveArray.push(JSON.parse(liveResponse.body).items[0].id.videoId);
        } else {
          liveArray.push(null);
        }
      }

      const data = JSON.parse(response.body)

      return res.json({
        data,
        liveArray
      });
    } catch (e) {
      return next(e);
    }
  });

  //Get past stream info from videoId
  app.post('/youtube/stream/videoId', async (req, res, next) => {
    try {
      
      const youtubeAdmin = await User.findOne({ attributes: {}, where: {
        email: 'admin@heystream.com'}});

      const youtubeSession = await YouTube.findOne({ attributes: {}, where: {
        userId: youtubeAdmin.dataValues.id}});
      
      const response = await got.get('https://www.googleapis.com/youtube/v3/videos'
      + '?part=id,snippet'
      + '&id=' + req.body.videoId, {
        headers: {
          'Authorization': 'Bearer ' + youtubeSession.dataValues.access_token
        }
      });

      const streamInfo = JSON.parse(response.body).items[0];

      return res.json({
        "data": streamInfo
      })
    } catch (e) {
      return next(e);
    }
  });

  // Get clips from a youtube videoId: str, userId: str and next: bool
  app.post('/youtube/vod/clips', async (req, res, next) => {

    try {
      //Start checks to stop if needed or requested
      if(!req.body.userId || !String(req.body.videoId) || req.body.next == null) {
        return next(new Error("Incorrect parameters"));
      }
    
      const yt = await YouTube.findOne({ attributes: {}, where: {
        userId: req.body.userId}});
        
      const videoDetails = await got.get('https://www.googleapis.com/youtube/v3/videos'
          + '?part=contentDetails'
          + '&id=' + String(req.body.videoId), {
            headers: {
              'Authorization': 'Bearer ' + yt.access_token,
            },
      });

      const preVideoDuration = JSON.parse(videoDetails.body).items[0].contentDetails.duration.substring(2).match(/(\d+)H(\d+)M(\d+)S/);
      const videoDuration = new Date(2020,1,11,(preVideoDuration[1] - 1),preVideoDuration[2],preVideoDuration[3]);

      const ytChat = await YoutubeChat.findOne({ attributes: {}, where: {
        videoId: String(req.body.videoId)}});

      if (ytChat) {
        const [h,m,s] = ytChat.lastTimestamp.split(':');
        const ltimestamp = new Date(2020,1,11,h,m,s);
        if (videoDuration < ltimestamp) { 
          return res.json({
            "data": ytChat.chat,
            "next": false
          });
        }
      }

      if(req.body.next === false && ytChat){
        return res.json({
          "data": ytChat.chat,
          "next": true
        }); 
      }
      // Start main body
      var responseArray = [];
      var totalImpressions = [];
      var nextTime = 0;

      if (req.body.next) {
        const ytChat = await YoutubeChat.findOne({ attributes: {}, where: {
          videoId: String(req.body.videoId)}});
        if(ytChat) {
          if (Number(ytChat?.lastTimestamp.split(':').length) <= 2) {
            nextTime = 0;
          } else {
            nextTime = Number(ytChat?.lastTimestamp.split(':')[0]);
          }
        } 
      }
      
      //Start getting chat
      if(nextTime == 0 && !ytChat) {
        await Promise.all([
          got.get('http://python-service:7104/youtube/chat/' + String(req.body.videoId) + '/' + Number(60*1) + '/' + '30_0'),
          got.get('http://python-service:7104/youtube/chat/' + String(req.body.videoId) + '/' + Number(60*30) + '/' + '1_00_0'),
        ]).then((values) => {
          for(let val of values) {
            if(val != null) {
              responseArray.push(JSON.parse(val.body));
            }
          }
        });
      } else {
        await Promise.all([
          got.get('http://python-service:7104/youtube/chat/' + String(req.body.videoId) + '/' + Number(60*60*1+3600*(nextTime)) + '/' + String(Number(Number(nextTime)+1)) + '_30_0'),
          got.get('http://python-service:7104/youtube/chat/' + String(req.body.videoId) + '/' + Number(60*60*1.5+3600*(nextTime)) + '/' + String(Number(Number(nextTime)+2)) + '_00_0'),
        ]).then((values) => {
          for(let val of values) {
            if(val != null) {
              responseArray.push(JSON.parse(val.body));
            }
          }
        });
      }      

      const flattenedResponse = [].concat.apply([], responseArray);
      //Start looking for impressions
      for (let i = 0; i < flattenedResponse.length; i = i + 250) {
        var impressions = 0;
        for (let j = 0; j < 250; j++) {
          var n = String(flattenedResponse[i + j]).search(/(ha)+|l(ol)+|(jaj)+|(pog)+|(kekw)+|(xd+)|lul|(ja)+|(kk+)/i);
          
          if(n != -1) impressions++;
        }
        if(impressions >= 60 && flattenedResponse.length > 0) {
          const msg = flattenedResponse[i].split('-');
          totalImpressions.push([{
            "time": msg[0],
            "title": msg[1], 
            "impressions": impressions
          }]);
        }
      }
      //Start saving on DB depending of current iteration (first, second...)
      if(req.body.next) {
        const chat = await YoutubeChat.findOne({ attributes: {}, where: {
            videoId: String(req.body.videoId)}
        });

        const chatImpressions = [];

        if(chat) {
          for(let chats of chat.chat) {
            totalImpressions.push(chats);
          }
          chatImpressions.push(totalImpressions);
          
        } else {
          chatImpressions.push(totalImpressions);
        }

        chat.chat = JSON.stringify(totalImpressions);
        chat.lastTimestamp = flattenedResponse.slice(-5)[0]?.split('-')[0] ? flattenedResponse.slice(-5)[0].split('-')[0] : null;

        await chat.save();

        const [h,m,s] = chat.lastTimestamp.split(':');
        const ltimestamp = new Date(2020,1,11,h,m,s);
        if (videoDuration < ltimestamp) { 
          return res.json({
            flattenedResponse,
            "data": JSON.parse(chat.chat),
            "next": false
          });
        }
      } else {
        await YoutubeChat.findOrCreate({
          where: {
            videoId: String(req.body.videoId),
          },
          defaults: {
            id: generateUUID(),
            chat: JSON.stringify(totalImpressions),
            lastTimestamp: flattenedResponse.slice(-5)[0]?.split('-')[0] ? flattenedResponse.slice(-5)[0].split('-')[0] : null
          }    
        });
      }
      //Default return
      return res.json({
        flattenedResponse,
        "data": totalImpressions,
        "next": true
      });
    } catch (error) {
     return next(error); 
    }
  });
  
  app.post('/youtube/streams/followed', async (req, res, next) => {
    try {

      const yt = await YouTube.findOne({ attributes: {}, where: {
        userId: req.body.userId}});

      const accessToken = yt.access_token;

      const response1 = await got.get('https://www.googleapis.com/youtube/v3/subscriptions'
        + '?part=snippet'
        + '&mine=true'
        + '&maxResults=50'
        + '&order=relevance'
        + '&pageToken=', {
          headers: {
            'Authorization': 'Bearer ' + accessToken,
          },
      });

      var responseArray = [];

      for(let a = 0; a < 5; a = a + 1) {
        await Promise.all([
          checkChannelLive(JSON.parse(response1.body).items[0+10*a]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[0+10*a].snippet.resourceId.channelId : null, accessToken),
          checkChannelLive(JSON.parse(response1.body).items[1+10*a]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[1+10*a].snippet.resourceId.channelId : null, accessToken),
          checkChannelLive(JSON.parse(response1.body).items[2+10*a]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[2+10*a].snippet.resourceId.channelId : null, accessToken),
          checkChannelLive(JSON.parse(response1.body).items[3+10*a]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[3+10*a].snippet.resourceId.channelId : null, accessToken),
          checkChannelLive(JSON.parse(response1.body).items[4+10*a]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[4+10*a].snippet.resourceId.channelId : null, accessToken),
          checkChannelLive(JSON.parse(response1.body).items[5+10*a]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[5+10*a].snippet.resourceId.channelId : null, accessToken),
          checkChannelLive(JSON.parse(response1.body).items[6+10*a]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[6+10*a].snippet.resourceId.channelId : null, accessToken),
          checkChannelLive(JSON.parse(response1.body).items[7+10*a]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[7+10*a].snippet.resourceId.channelId : null, accessToken),
          checkChannelLive(JSON.parse(response1.body).items[8+10*a]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[8+10*a].snippet.resourceId.channelId : null, accessToken),
          checkChannelLive(JSON.parse(response1.body).items[9+10*a]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[9+10*a].snippet.resourceId.channelId : null, accessToken),
        ]).then((values) => {
          for(let val of values) {
            if(val != null) {
              responseArray.push(val);
            }
          }
        });
      }

      const totalResults = JSON.parse(response1.body).pageInfo.totalResults;
      const resultsPerPage = JSON.parse(response1.body).pageInfo.resultsPerPage;
      var nextPageToken = typeof JSON.parse(response1.body).nextPageToken == 'undefined' ? "" : JSON.parse(response1.body).nextPageToken;

      var i = resultsPerPage;
      
      while(i < totalResults) {
        const {resNextPageToken, array} = await parseFollowedChannelsPage(nextPageToken, accessToken);
        nextPageToken = resNextPageToken;
        responseArray.push(array);
        i = i + resultsPerPage;
      }

      var flattenedResponse = [].concat.apply([], responseArray);
     
      return res.json({
        response: flattenedResponse
      });
    } catch (e) {
      return next(e);
    }
  });

  //Get past stream info from channel Id
  app.post('/youtube/stream/channelId', async (req, res, next) => {
    try {

      const youtubeAdmin = await User.findOne({ attributes: {}, where: {
        email: 'admin@heystream.com'}});

      const youtubeSession = await YouTube.findOne({ attributes: {}, where: {
        userId: youtubeAdmin.dataValues.id}});
      
      const response = await got.get('https://www.googleapis.com/youtube/v3/videos'
      + '?part=id,snippet'
      + '&id=' + req.body.videoId, {
        headers: {
          'Authorization': 'Bearer ' + youtubeSession.access_token
        }
      });

      const channelId = JSON.parse(response.body).items[0].snippet.channelId;

      return res.json({
        channelId
      })
    } catch (e) {
      return next(e);
    }
  });

  // Get Youtube user info (from youtube)
  app.post('/youtube/user', async (req, res, next) => {
    try {

      const yt = await YouTube.findOne({ attributes: {}, where: {
        userId: req.body.userId}});

      const response = await got.get('https://www.googleapis.com/youtube/v3/channels'
      + '?part=snippet'
      + '&mine=true', {
        headers: {
          'Authorization': 'Bearer ' + yt.access_token
        }
      })

      return res.json(JSON.parse(response.body).items[0].snippet);
    } catch (e) {
      return next(e);
    }
  });

  // Get youtube top 10 streams for the home page
  app.get("/youtube/streams/top", async (req, res, next) => {
    try {
      
      const youtubeAdmin = await User.findOne({ attributes: {}, where: {
        email: 'admin@heystream.com'}});

      const youtubeSession = await YouTube.findOne({ attributes: {}, where: {
        userId: youtubeAdmin.dataValues.id}});

      const response = await got.get('https://www.googleapis.com/youtube/v3/search'
      + '?part=snippet'
      + '&eventType=live'
      + '&type=video'
      + '&videoCategoryId=20'
      + '&maxResults=10'
      + '&order=viewCount', 
      {
        headers: {
          'Authorization': 'Bearer ' + youtubeSession.dataValues.access_token
      }});  

      return res.json(JSON.parse(response.body));
    } catch (e) {
      return next(e);
    }
  });

  // Get the URL to redirect an user to login to their youtube account
  app.get("/youtube/link", async (req, res, next) => {
    try {

      const uri = 'https://accounts.google.com/o/oauth2/auth'
      + '?client_id=' + YOUTUBE_CLIENT_ID 
      + '&redirect_uri=' + REDIRECT_URI_LANDING
      + '&scope=https://www.googleapis.com/auth/youtube.readonly'
      + '&response_type=code'
      + '&access_type=offline'
      + '&prompt=consent'

      return res.json(uri)

    } catch (e) {
      return next(e);
    }
  });

  // Process the code given by Youtube to obtain an access_token. Then store it on the DB
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

      const data = JSON.parse(response.body);

      const user = await got.get("http://users-service:7101/sessions/" + req.body.userId);

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

  // Refresh the youtube access_token of an userId
  app.post("/youtube/refreshToken", async (req, res, next) => {
    try {
      
      const yt = await YouTube.findOne({ attributes: {}, where: {
        userId: req.body.userId}});

      //if (!yt) return await next(new Error("No data for this user ID!"));

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

  // Get previous finished streams from youtube
  app.post("/youtube/streams/vods", async (req, res, next) => {
    try {

      const youtubeAdmin = await User.findOne({ attributes: {}, where: {
        email: 'admin@heystream.com'}});

      const youtubeSession = await YouTube.findOne({ attributes: {}, where: {
        userId: youtubeAdmin.dataValues.id}});

      const response = await got.get('https://www.googleapis.com/youtube/v3/search'
      + '?part=id,snippet'
      + '&channelId=' + req.body.channelId
      + '&type=video'
      + '&eventType=completed'
      + '&maxResults=50'
      + '&order=date', {
        headers: {
          Authorization: 'Bearer ' + youtubeSession.dataValues.access_token
        }
      });

      return res.json({
        data: JSON.parse(response.body)
      });
    } catch (e) {
      return next(e);
    }
  });

  // Get user's youtube data user by userId
  app.get("/youtube/:userId", async (req, res, next) => {
    try {
      const yt = await YouTube.findOne({ attributes: {}, where: {
        userId: req.params.userId}});

      //if (!yt) return await next(new Error("No data for this user ID!"));

      return res.json(yt);
    } catch (e) {
      return next(e);
    }
  });

  // Delete user's youtube data user by userId
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