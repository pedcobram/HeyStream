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
import YoutubeVods from './views/YoutubeVods';
import YoutubeVod from './views/YoutubeVod';
import Search from './views/Search';

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
            <Route exact path="/search" component={Search} />

            <Switch>
                <Route exact path="/twitch/stream/:user" children={<TwitchStream/>}/>
                <Route exact path="/youtube/stream/:videoId" children={<YoutubeStream/>}/>
                <Route exact path="/twitch/vod/:vodId" children={<TwitchVod/>}/>
                <Route exact path="/twitch/vod/:vodId/:timestamp" children={<TwitchVod/>}/>
                <Route exact path="/twitch/vods/:user" children={<TwitchVods/>}/>
                <Route exact path="/youtube/vod/:videoId" children={<YoutubeVod/>}/>
                <Route exact path="/youtube/vod/:videoId/:timestamp" children={<YoutubeVod/>}/>
                <Route exact path="/youtube/vods/:channelId" children={<YoutubeVods/>}/>
            </Switch>
        </div>
    );
};

export default Router;