import React, {useState} from 'react';
import {
    ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarBrand, NavItem,
    NavLink
} from 'reactstrap';
import {logout, openModal} from "../UserProfile/Login/redux/actions";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import "./Navigation.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {BrowserView, MobileView, isBrowser} from "react-device-detect";


const Navigation = ({isUserLoggedIn, openLoginModal, email, logout, history, showItemsCount}) => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleUserMenu = () => setIsOpen(!isOpen);

    let toggleNavItem;

    //if user is not logged in we see "Login" button otherwise "hello, user_email"/ "Profile".
    if (isUserLoggedIn) {

        let mail_name = email.substring(0, email.indexOf('@'));
        let capitalized_name = mail_name.charAt(0).toUpperCase() + mail_name.slice(1);

        toggleNavItem =
            <ButtonDropdown isOpen={isOpen} toggle={toggleUserMenu}>
                <DropdownToggle nav caret className={"text-header-standard"} id={'user-menu'}>
                    {isBrowser ? (
                        `hello, ${capitalized_name}`
                    ) : (
                        `Profile`
                    )}
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem onClick={() => history.push("/account")}>My Account</DropdownItem>
                    <DropdownItem divider/>
                    <DropdownItem onClick={logout}>Log Out</DropdownItem>
                </DropdownMenu>
            </ButtonDropdown>
    } else {
        toggleNavItem =
            <NavItem className={'text-header-highlight'}>
                <NavLink onClick={openLoginModal} className={"text-header"}>Login</NavLink>
            </NavItem>
    }


    return (
        <Navbar fixed={"top"} light expand={false}>
            <NavbarBrand id={"navbar-logo"} href="/">
                {/*<img src={} alt="VintageEarrings logo"/>*/}
                <span className={"text-header-important"} id={'navbar-text'}>VintageEarrings</span>
            </NavbarBrand>
            <Nav>
                {toggleNavItem}
                <NavItem>
                    <NavLink className={'text-header-highlight'}>
                        <div onClick={() => history.push("/basket")}>
                            <FontAwesomeIcon icon="shopping-cart"/>
                            {showItemsCount > 0 && <span> {showItemsCount}</span>}
                        </div>
                    </NavLink>
                </NavItem>
            </Nav>
        </Navbar>
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