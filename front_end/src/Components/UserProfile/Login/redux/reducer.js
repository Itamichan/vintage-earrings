//a reducer takes a previous state, modifies it and return the new state

import jwt_decode from "jwt-decode";

const initialState = {
    loggedIn: false,
    modalOpen: false,
    email: undefined
};

const LoginReducer = (state, action) => {

    if (typeof state === "undefined") {
        return initialState
    }
    switch (action.type) {
        case  "LOGOUT":
            localStorage.setItem("token", "");
            return {
                //unwraps the state dict
                ...state,
                loggedIn: false,
                email: undefined,
            };
        case "LOGIN":
            localStorage.setItem("token", action.token);
            // extracting the user email from the jwt token
            const email = jwt_decode(action.token)["email"];
            return {
                ...state,
                loggedIn: true,
                modalOpen: false,
                email: email,
            };
        case "OPEN_MODAL":
            return {
                ...state,
                modalOpen: true
            };
        case "CLOSE_MODAL":
            return {
                ...state,
                modalOpen: false
            };
        default:
            return state
    }
};

export default LoginReducer;

