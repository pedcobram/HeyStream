import got from "got";

import accessEnv from "#root/helpers/accessEnv"

const TWITCH_CLIENT_ID = accessEnv("TWITCH_CLIENT_ID", "ne4n4c0oenxn6zgq2ky3vtvvfowe1b");

const checkChannelLive = async (channelArray, access_token) => {
  
    var uri = 'https://api.twitch.tv/helix/streams';
  
    channelArray = channelArray.filter(function (el) {
      return el != null;
    });
  
    for (let i in channelArray) {
      if(i == 0) {
        var user = '?user_login=' + channelArray[0];
        uri = uri.concat(user);
      } else {
        var user = '&user_login=' + channelArray[i];
        uri = uri.concat(user);
      }
    }
  
    const response = await got.get(uri,
        {
          headers: {
            'Authorization': 'Bearer ' + access_token,
            'Client-Id': TWITCH_CLIENT_ID
          }
    });
  
    if(JSON.parse(response.body).data.length == 0) return null;
    return JSON.parse(response.body).data;
}

export default checkChannelLive;