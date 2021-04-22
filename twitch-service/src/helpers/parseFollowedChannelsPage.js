import got from "got";

import accessEnv from "#root/helpers/accessEnv"
import checkChannelLive from "#root/helpers/checkChannelLive"

const TWITCH_CLIENT_ID = accessEnv("TWITCH_CLIENT_ID", "lssv1zkc8pk1cvuo7tbdq3j0gtbxdr");

const parseFollowedChannelsPage = async (myChannelId, pagination, access_token) => {
    var array2 = [];
  
    const response2 = await got.get('https://api.twitch.tv/helix/users/follows'
        + '?from_id=' + myChannelId
        + '&first=50'
        + '&after=' + pagination, {
          headers: {
            'Authorization': 'Bearer ' + access_token,
            'Client-Id': TWITCH_CLIENT_ID
    }});
    
    const resPagination = JSON.parse(response2.body).pagination.cursor;
  
    var channelArray2 = [];
    for(let b = 0; b < 5; b++) {
      var dirtyArray = [];
      for (let a = 0; a < 10; a++) {
        dirtyArray.push(JSON.parse(response2.body).data[a+10*b]?.to_login ? JSON.parse(response2.body).data[a+10*b].to_login : null);
      }
      channelArray2.push(dirtyArray);
    }
  
    var channelArray = [].concat.apply([], channelArray2);
  
    await Promise.all([
      await checkChannelLive(channelArray.slice(0,25), access_token),
      await checkChannelLive(channelArray.slice(25,50), access_token),
    ]).then((values) => {
      for(let val of values) {
        if(val != null) {
          array2.push(val);
        }
      }
    });

    var array = [].concat.apply([], array2);
   
    return {resPagination, array};
  };

export default parseFollowedChannelsPage;