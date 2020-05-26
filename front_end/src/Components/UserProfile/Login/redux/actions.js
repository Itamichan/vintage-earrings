export const login = (token, userInfo) => {
    return {
        type: "LOGIN",
        token: token,
        userInfo: userInfo
    }
};

export const logout = () => {
    return {
        type: "LOGOUT"
    }
};

export const openModal = () => {
    return {
        type: "OPEN_MODAL"
    }
};

export const closeModal = () => {
    return {
        type: "CLOSE_MODAL"
    }
};