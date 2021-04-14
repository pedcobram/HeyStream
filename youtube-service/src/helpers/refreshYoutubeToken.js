import got from "got";
import qs from 'qs';

import { User, YouTube } from "#root/db/models";
import accessEnv from "#root/helpers/accessEnv"

const YOUTUBE_CLIENT_ID = accessEnv("YOUTUBE_CLIENT_ID", "114734933279-i6im8fvce39v2ub9aj4h9igoj1rm448i.apps.googleusercontent.com");
const YOUTUBE_CLIENT_SECRET = accessEnv("YOUTUBE_CLIENT_SECRET", "H5Mlg7C8-R4ebHaa41HuuZ-k");

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