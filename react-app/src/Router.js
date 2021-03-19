import React from 'react';
import { Route, Switch } from "react-router-dom";

import Home from "./views/Home";
import Account from "./views/Account";
import Test from "./views/Test";
import LandingTwitch from './views/LandingTwitch';
import LandingYoutube from './views/LandingYoutube';
import TwitchStream from './views/TwitchStream'

function Router() {
    return (
        <div>
            <Route exact path="/" component={Home} />
            <Route exact path="/account" component={Account} />
            <Route exact path="/twitch/landing" component={LandingTwitch} />
            <Route exact path="/twitch" component={TwitchStream} />
            <Route exact path="/youtube/landing" component={LandingYoutube} />
            <Route exact path="/test" component={Test}/>

            <Switch>
                <Route exact path="/twitch/:user" children={<TwitchStream />} />
            </Switch>
        </div>
    );
};

export default Router;