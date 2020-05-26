//a reducer takes a previous state, modifies it and return the new state

const initialState = {
    loggedIn: false,
    modalOpen: false,
    username: undefined,
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
                username: undefined,
                email: undefined,
            };
        case "LOGIN":
            localStorage.setItem("token", action.token);
            return {
                ...state,
                loggedIn: true,
                modalOpen: false,
                username: action.userInfo.username,
                email: action.userInfo.email,
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