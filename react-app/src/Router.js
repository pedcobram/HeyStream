import React from 'react';
import { Route, Switch } from "react-router-dom";

import Home from "./views/Home";
import Account from "./views/Account";
import LandingTwitch from './views/LandingTwitch';
import LandingYoutube from './views/LandingYoutube';
import TwitchStream from './views/TwitchStream';
import YoutubeStream from './views/YoutubeStream';
import MyStreams from './views/MyStreams';
import TwitchVods from './views/TwitchVods';
import TwitchVod from './views/TwitchVod';

function Router() {
    return (
        <div>
            <Route exact path="/" component={Home} />
            <Route exact path="/account" component={Account} />
            <Route exact path="/twitch" component={TwitchStream} />
            <Route exact path="/twitch/landing" component={LandingTwitch} />
            <Route exact path="/youtube" component={YoutubeStream} />
            <Route exact path="/youtube/landing" component={LandingYoutube} />
            <Route exact path="/myStreams" component={MyStreams} />

            <Switch>
                <Route exact path="/twitch/stream/:user" children={<TwitchStream/>}/>
                <Route exact path="/youtube/stream/:videoId" children={<YoutubeStream/>}/>
                <Route exact path="/twitch/vod/:vodId" children={<TwitchVod/>}/>
                <Route exact path="/twitch/vods/:user" children={<TwitchVods/>}/>
            </Switch>
        </div>
    );
};

export default Router;