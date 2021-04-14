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

export default parseChat;