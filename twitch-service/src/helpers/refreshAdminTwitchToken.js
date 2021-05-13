import got from "got";

import { User, Twitch } from "#root/db/models";
import accessEnv from "#root/helpers/accessEnv";
import generateUUID from "#root/helpers/generateUUID";

const TWITCH_CLIENT_ID = accessEnv("TWITCH_CLIENT_ID", "lssv1zkc8pk1cvuo7tbdq3j0gtbxdr");
const TWITCH_CLIENT_SECRET = accessEnv("TWITCH_CLIENT_SECRET", "ebn5zvav8txjcujnrfphv8k9fy9hme");

function refreshAdminTwitchToken() {
    (async () => {

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
            });
        } else {
            await Twitch.create({
            userId: twitchAdmin.dataValues.id,
            id: generateUUID(),
            access_token: data.access_token,
            refresh_token: null        
            });
        }

    })();
    console.log("Admin Twitch access token updated!!");
    return true;
}

export default refreshAdminTwitchToken;


      