import gql from 'graphql-tag';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import graphqlClient from "#root/api/graphql/graphqlClient";
import { setSession } from "#root/store/ducks/session";

import AccountDetails from "#root/components/CustomNavBar/AccountDetails";
import Account from "#root/components/CustomNavBar/AccountDetails/Account";

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import DropdownButton from "react-bootstrap/DropdownButton"
import NavDropdown from "react-bootstrap/NavDropdown"

import "bootstrap/dist/css/bootstrap.min.css";

import logo from "../../images/logo.png"

const query = gql`
    {
        userSession(me: true) {
            id
            user {
                email
                id
            }
        }
    }
`;

const CustomNavBar = () => {

    const dispatch = useDispatch();
    const [initialised, setInitialised] = useState(false);

    useEffect(() => {
        graphqlClient.query({ query }).then(({ data }) => {
            if(data.userSession) {
                dispatch(setSession(data.userSession));
            }
            setInitialised(true);
        })
    }, []);

    const session = useSelector(state => state.session);    

    if (session) {
        return (
            <>
                <Navbar id="navbar" expand="lg">
                    <Navbar.Brand id="logo" href="/">
                        <img
                            src={logo}
                            width="40"
                            height="40"
                            className="d-inline-block "
                            alt="HeyStream logo"
                        />{' '}
                    HeyStream</Navbar.Brand>
                    <Nav className="ml-auto" id="nav" >
                        <Nav.Item>
                            <Nav.Link id="myStreams" href="/myStreams">My Streams</Nav.Link>
                        </Nav.Item> 
                        <Nav.Item >
                            <NavDropdown title={session.user.email} id="collasible-nav-dropdown">
                                <NavDropdown.Item id="navItem" href="/account">Account</NavDropdown.Item>
                            </NavDropdown>
                        </Nav.Item>
                        <Nav.Item id="item"> 
                            <Account /> 
                        </Nav.Item>
                    </Nav>
                </Navbar>
                <br />
            </>
        )
    }

    if(!initialised) return "Loading...";

    return (
        <>
            <Navbar id="navbar" expand="lg">
                <Navbar.Brand id="logo" href="/">HeyStream</Navbar.Brand>
                <Nav className="ml-auto" id="nav">
                    <Nav.Item>
                        <DropdownButton title="Account" key="left" id="dropdown-button-drop-left" drop="left">
                            <AccountDetails />
                        </DropdownButton>
                    </Nav.Item>
                </Nav>
            </Navbar>
            <br />
        </>
    )
};

export default CustomNavBar;