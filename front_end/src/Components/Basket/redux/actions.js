
export const addToBasket = (item) => {
    return {
        type: "ADD_TO_BASKET",
        item: item,
    }
};

export const loadBasket = (items) => {
    return {
        type: "LOAD_BASKET",
        items: items,
    }
};

export const updateBasket = (itemId, itemQuantity) => {
    return {
        type: "UPDATE_BASKET",
        itemId: itemId,
        itemQuantity: itemQuantity
    }
};
