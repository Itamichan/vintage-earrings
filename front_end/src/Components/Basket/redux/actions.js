
export const addToBasket = (item) => {
    return {
        type: "ADD_TO_BASKET",
        item: item,
    }
};

export const removeFromBasket = (itemId) => {
    return {
        type: "REMOVE_FROM_BASKET",
        itemId: itemId,
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

export const cleanBasket = () => {
    return {
        type: "CLEAN_BASKET"
    }
};

