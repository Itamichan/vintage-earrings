
export const AddToBasket = (product_id) => {
    return {
        type: "ADD_TO_BASKET",
        product_id: product_id,
    }
};
