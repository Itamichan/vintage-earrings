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
            basketItems: [...state.basketItems, action.item]
        };
    }
    if (action.type === "LOAD_BASKET") {

        return {
            ...state,
            basketItems: [...action.items]
        };
    }
};

export default BasketReducer;