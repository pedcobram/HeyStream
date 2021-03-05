import React from 'react';
import { Route, Link } from "react-router-dom";

import Root from "./components/Root/Root";
import Test from "./Test";

function Home() {
    return (
        <div>
            <Route exact path="/" component={Root} />
            <Route exact path="/test" component={Test}/>
        </div>
    );
};

export default Home;