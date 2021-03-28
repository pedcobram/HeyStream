import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import refreshTwitchToken from "#root/helpers/refreshTwitchToken"
import accessEnv from "#root/helpers/accessEnv"

import setupRoutes from "./routes";

const PORT = accessEnv("PORT", 7103);

const app = express();

app.use(bodyParser.json());

app.use(
    cors({
        origin: (origin, cb) => cb(null, true),
        credentials: true
    })
);

setupRoutes(app);
 
app.use((err, req, res, next) => {
    return res.status(500).json({ 
        message: err.message
    });
});

//Cada 30 minutos refrescamos tokens de Twitch
setInterval(refreshTwitchToken, 1000*60*30)

app.listen(PORT, "0.0.0.0", () => {
    console.info(`Twitch service listening on ${PORT}`) 
});