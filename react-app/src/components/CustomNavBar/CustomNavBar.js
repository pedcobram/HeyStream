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

    const style = {
        paddingRight: '0.25rem'
    };

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
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand href="/">App</Navbar.Brand>
                    <Nav className="ml-auto">
                        <Nav.Item style={style}> 
                            <NavDropdown title={session.user.email} id="collasible-nav-dropdown">
                                <NavDropdown.Item href="/account">Account</NavDropdown.Item>
                            </NavDropdown>
                        </Nav.Item>
                        <Nav.Item style={style}> <Account /> </Nav.Item>
                    </Nav>
                </Navbar>
                <br />
            </>
        )
    }

    if(!initialised) return "Loading...";

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">App</Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Item style={style}>
                        <DropdownButton title="Cuenta" key="left" id="dropdown-button-drop-left" drop="left">
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