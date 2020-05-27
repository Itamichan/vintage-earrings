import React from 'react';
import "./Layout.scss";
import Navigation from "../Navigation/Navigation";
import Login from "../UserProfile/Login/Login";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

const Layout = (props) => {
    return (
        <div>
            <Router>
                <Navigation/>
                <Login/>
            </Router>
        </div>
    )
};

export default Layout;