import React from 'react';
import "./UserAccount.scss";
import {closeModal, login} from "../Login/redux/actions";
import {connect} from "react-redux";
import {withRouter} from "react-router";

const UserAccount = ({isUserLoggedIn, history}) => {
    return (
        <div>
            {
                isUserLoggedIn ? (
                    <div id={'account-container'} className={"start-point"}>
                        user account
                    </div>
                ) : (
                    history.push("/")
                )}
        </div>
    )
};

//dispatch will move the provided action dict (result of login(token))
// to the global state and will run the reducer with the provided action
const mapDispatchToProps = (dispatch) => {
    return {}
};

//map the global state to properties that are passed into the comp
const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.LoginReducer.loggedIn,
    }
};

//next line ensures that the properties from the 2 passed functions are passed to Login comp
const DefaultApp = withRouter(connect(mapStateToProps, mapDispatchToProps)(UserAccount));
export default DefaultApp;