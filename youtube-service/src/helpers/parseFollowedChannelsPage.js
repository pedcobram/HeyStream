import got from "got";
import checkChannelLive from "#root/helpers/checkChannelLive";;

const parseFollowedChannelsPage = async (pageToken, accessToken) => {
    var array = [];
  
    const response1 = await got.get('https://www.googleapis.com/youtube/v3/subscriptions'
        + '?part=snippet'
        + '&mine=true'
        + '&maxResults=50'
        + '&order=relevance'
        + '&pageToken=' + pageToken, {
          headers: {
            'Authorization': 'Bearer ' + accessToken,
          },
    });
  
    const resNextPageToken = JSON.parse(response1.body).nextPageToken;
  
    for(let i = 0; i < 5; i = i + 1) {
      await Promise.all([
        checkChannelLive(JSON.parse(response1.body).items[0+10*i]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[0+10*i].snippet.resourceId.channelId : null, accessToken),
        checkChannelLive(JSON.parse(response1.body).items[1+10*i]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[1+10*i].snippet.resourceId.channelId : null, accessToken),
        checkChannelLive(JSON.parse(response1.body).items[2+10*i]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[2+10*i].snippet.resourceId.channelId : null, accessToken),
        checkChannelLive(JSON.parse(response1.body).items[3+10*i]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[3+10*i].snippet.resourceId.channelId : null, accessToken),
        checkChannelLive(JSON.parse(response1.body).items[4+10*i]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[4+10*i].snippet.resourceId.channelId : null, accessToken),
        checkChannelLive(JSON.parse(response1.body).items[5+10*i]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[5+10*i].snippet.resourceId.channelId : null, accessToken),
        checkChannelLive(JSON.parse(response1.body).items[6+10*i]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[6+10*i].snippet.resourceId.channelId : null, accessToken),
        checkChannelLive(JSON.parse(response1.body).items[7+10*i]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[7+10*i].snippet.resourceId.channelId : null, accessToken),
        checkChannelLive(JSON.parse(response1.body).items[8+10*i]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[8+10*i].snippet.resourceId.channelId : null, accessToken),
        checkChannelLive(JSON.parse(response1.body).items[9+10*i]?.snippet.resourceId.channelId ? JSON.parse(response1.body).items[9+10*i].snippet.resourceId.channelId : null, accessToken),
      ]).then((values) => {
        for(let val of values) {
          if(val != null) {
            array.push(val);
          }
        }
      });
    }
  
    return {resNextPageToken, array}
}

export default parseFollowedChannelsPage;