const initialState = {
    basketItems: []
};

const BasketReducer = (state, action) => {

    if (typeof state === "undefined") {
        return initialState
    }
    switch (action.type) {
        case  "BASKET":
            //store in our local storage the id of created basket
            localStorage.setItem("basket_id", action.basket_id);
            return {
                //unwraps the state dict
                ...state
            };
        case  "ADD_TO_BASKET":
            let basketItemsList = state.basketItems.push(action.product_id);
            return {
                ...state,
                basketItems: basketItemsList
            };
        default:
            return state
    }
};

export default BasketReducer;

