import React, { useState } from "react";
import { useSelector } from "react-redux";

import Login from "./Login";
import Account from "./Account";
import SignUp from "./SignUp";

const AccountDetails = () => {
    const session = useSelector(state => state.session);
    const [isSigningUp, setIsSingningUp] = useState(false);

    if (session) return <Account />;

    return isSigningUp ? <SignUp onChangeToLogin = {() => {
        setIsSingningUp(false);
    }} /> : <Login onChangeToSignUp={() => {
        setIsSingningUp(true);
    }} />;
};

export default AccountDetails;