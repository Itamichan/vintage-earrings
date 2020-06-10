const initialState = {
    basketItems: []
};

const BasketReducer = (state, action) => {

    if (typeof state === "undefined") {
        return initialState
    }

    switch (action.type) {
        case  "ADD_TO_BASKET":
            return {
                ...state,
                basketItems: [...state.basketItems, action.item]
            };
        case "LOAD_BASKET":

            return {
                ...state,
                basketItems: [...action.items]
            };
        case "UPDATE_BASKET":
            let updateBasket = state.basketItems.map(item => {
                if (item.id === action.itemId) {
                    return {
                        ...item,
                        items_quantity: action.itemQuantity
                    }
                }
                return item
            });
            return {
                ...state,
                basketItems: updateBasket
            };

        default:
            return state
    }
};

export default BasketReducer;