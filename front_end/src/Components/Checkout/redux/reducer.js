const initialState = {
    basketItems: [],

};

const BasketReducer = (state, action) => {

    if (typeof state === "undefined") {
        return initialState
    }
    if (action.type === "ADD_TO_BASKET") {
        let basketItemsList = state.basketItems.push(action.product_id);
        return {
            //unwraps the state dict
            ...state,
            basketItems: basketItemsList
        };
    } else {
        return state
    }
};

export default BasketReducer;

