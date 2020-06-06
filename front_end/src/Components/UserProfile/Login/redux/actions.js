export const login = (token) => {
    return {
        type: "LOGIN",
        token: token
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