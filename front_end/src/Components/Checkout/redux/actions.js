export const Basket = (basket_id) => {
    return {
        type: "BASKET",
        basket_id: basket_id,
    }
};

export const AddToBasket = (product_id) => {
    return {
        type: "ADD_TO_BASKET",
        product_id: product_id,
    }
};
