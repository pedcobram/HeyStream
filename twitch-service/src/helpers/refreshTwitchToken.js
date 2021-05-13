import got from "got";

import { Twitch } from "#root/db/models";
import accessEnv from "#root/helpers/accessEnv"

const TWITCH_CLIENT_ID = accessEnv("TWITCH_CLIENT_ID", "lssv1zkc8pk1cvuo7tbdq3j0gtbxdr");
const TWITCH_CLIENT_SECRET = accessEnv("TWITCH_CLIENT_SECRET", "ebn5zvav8txjcujnrfphv8k9fy9hme");

function refreshTwitchToken() {
    (async () => {

        const users = await Twitch.findAll({})

        for (const user of users) {
            if(user.dataValues.refresh_token != null) {

                const response = await got.post('https://id.twitch.tv/oauth2/token'
                + '?grant_type=refresh_token'
                + '&refresh_token=' + user.dataValues.refresh_token
                + '&client_id=' + TWITCH_CLIENT_ID
                + '&client_secret=' + TWITCH_CLIENT_SECRET)

                const parsed_response = JSON.parse(response.body);
                
                user.access_token = parsed_response.access_token;

                await user.save();
            }
        };

    })();
    console.log("Twitch access token updated for everyone!!");
    return true;
}

export default refreshTwitchToken;