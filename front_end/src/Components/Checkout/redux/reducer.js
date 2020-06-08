const initialState = {
    basketItems: []
};

const BasketReducer = (state, action) => {

    if (typeof state === "undefined") {
        return initialState
    }
    if (action.type === "ADD_TO_BASKET") {

        return {
            ...state,
            basketItems: [...state.basketItems, action.product]
        };
    } else {
        return state
    }
};

export default BasketReducer;