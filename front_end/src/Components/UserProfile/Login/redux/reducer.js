
import jwt_decode from "jwt-decode";

const initialState = {
    loggedIn: false,
    modalOpen: false,
    email: undefined,
    id:undefined,
    checkout: false
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
            const id = jwt_decode(action.token)["id"];
            return {
                ...state,
                loggedIn: true,
                modalOpen: false,
                email: email,
                id: id,
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
        case "CHECKOUT":
            return {
                ...state,
                checkout: true
            };
        default:
            return state
    }
};

export default LoginReducer;

