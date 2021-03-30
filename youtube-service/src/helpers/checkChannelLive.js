import got from "got";
import tunnel from "tunnel";
import serversList from './serverList';
import { HttpsProxyAgent } from "hpagent";



const checkChannelLive = async (channelId, access_token) => {

  if (channelId == null) {
    return null;
  }

  const response = await got.get("https://www.youtube.com/channel/" + channelId, {
    headers: {
      'Accept-Language': 'en-US,en;q=0.8',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) '
                    + 'AppleWebKit/537.36 (KHTML, like Gecko) '
                    + 'Chrome/75.0.3770.80 Safari/537.36',
      },
  });

  if(response.body.includes('"label":"LIVE"')) {

    const response = await got.get('https://www.googleapis.com/youtube/v3/search'
      + '?part=snippet'
      + '&channelId=' + channelId
      + '&type=video'
      + '&eventType=live'
      + '&order=relevance', {
        headers: {
          'Authorization': 'Bearer ' + access_token,
        }
      });
  
      return JSON.parse(response.body).items[0].snippet;

  } else {
    return null;
  }
}

export default checkChannelLive;