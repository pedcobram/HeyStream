import got from "got";

import { YouTube } from "#root/db/models";
import accessEnv from "#root/helpers/accessEnv"

const YOUTUBE_CLIENT_ID = accessEnv("YOUTUBE_CLIENT_ID", "677542340493-s40cnjmjhqmmtbd2vqde1ulp2mn7csd5.apps.googleusercontent.com");
const YOUTUBE_CLIENT_SECRET = accessEnv("YOUTUBE_CLIENT_SECRET", "T6Ii6L_F4UVGYBAWwvmv_hgS");

function refreshYoutubeToken() {
    (async () => {

        const users = await YouTube.findAll({})

        for (const user of users) {
            if(user.dataValues.refresh_token != null) {

                const response = await got.post('https://www.googleapis.com/o/oauth2/token'
                    + '?client_id=' + YOUTUBE_CLIENT_ID
                    + '&client_secret=' + YOUTUBE_CLIENT_SECRET
                    + '&refresh_token=' + user.dataValues.refresh_token
                    + '&grant_type=refresh_token',{ 
                    headers: {
                        Host: 'accounts.google.com',
                        ContentType: 'application/x-www-form-urlencoded'
                    }
                    }   
                );

                const parsed_response = JSON.parse(response.body);
                
                user.access_token = parsed_response.access_token;

                await user.save();
            }
        };

    })();
    console.log("Youtube access token updated for everyone!!");
    return true;
}

export default refreshYoutubeToken;