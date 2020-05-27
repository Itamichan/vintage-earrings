import React, {useState} from 'react';
import {
    ButtonDropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavItem,
    NavLink
} from 'reactstrap';
import {logout, openModal} from "../UserProfile/Login/redux/actions";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import logo from "../../static/images/logo_transerent.png";
import "./Navigation.scss";

const Navigation = ({isUserLoggedIn, openLoginModal, email, logout, history}) => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleUserMenu = () => setIsOpen(!isOpen);

    let toggleNavItem;

    //if user is not logged in we see "Login" button otherwise "Profile".
    if (isUserLoggedIn) {
        toggleNavItem =
            <ButtonDropdown isOpen={isOpen} toggle={toggleUserMenu}>
                <DropdownToggle nav caret className={"text-header"}>
                    {/*todo truncate the email only until @*/}
                    hello, {email}
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem onClick={() => history.push("/trips")}>Show my trips</DropdownItem>
                    <DropdownItem onClick={logout}>Log Out</DropdownItem>
                </DropdownMenu>
            </ButtonDropdown>
    } else {
        toggleNavItem = <NavItem>
            <NavLink onClick={openLoginModal} className={"text-header"}>Login</NavLink>
        </NavItem>
    }

    return (
        <div>
            <Navbar fixed={"top"} id={"navbar"} light expand={false}>
                <NavbarBrand id={"navbar-logo"} href="/">
                    <img src={logo} alt="VintageEarrings logo"/>
                    <span className={"text-header-important"}> VintageEarrings</span>
                </NavbarBrand>
                <Nav>
                    {toggleNavItem}
                </Nav>
            </Navbar>
        </div>
    )
};

//dispatch will move the provided action dict (result of login(token))
// to the global state and will run the reducer with the provided action
const mapDispatchToProps = (dispatch) => {
    return {
        openLoginModal: () => dispatch(openModal()),
        logout: () => dispatch(logout())
    }
};

//map the global state to properties that are passed into the comp
const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.LoginReducer.loggedIn,
        email: state.LoginReducer.email,
    }
};

//next line ensures that the properties from the 2 passed functions are passed to Login comp
const DefaultApp = withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigation));
export default DefaultApp;