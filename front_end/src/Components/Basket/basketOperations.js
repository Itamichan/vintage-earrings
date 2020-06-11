import {store} from "../../store";
import axios from "axios";
import {addToBasket, removeFromBasket, updateBasket} from "./redux/actions";


export const addItem = async (productId) => {

    let basketId = localStorage.getItem("basket_id");

    //before adding a product to the basket it ensures that the basket exists.
    if (!basketId) {
        let {data} = await axios.post(`api/v1/baskets/`);
        localStorage.setItem("basket_id", data.basket_id);
        //updating the value of the baskedId
        basketId = data.basket_id
    }

    let {data} = await axios.post(`api/v1/baskets/${basketId}/items/`, {
        'product_id': productId
    });
    //adds item to the basketItems in the BasketReducer.
    store.dispatch(addToBasket(data))
};

export const updateItem = async (itemId, itemQuantity) => {
    try {
        let basketId = localStorage.getItem("basket_id");
        await axios.patch(`api/v1/baskets/${basketId}/items/${itemId}`, {
            'quantity': itemQuantity
        });

        //updates the quantity of the item in the BasketReducer
        store.dispatch(updateBasket(itemId, itemQuantity))
    } catch (e) {
        console.log(e)
    } finally {
    }
};

export const removeItem = async (itemId) => {
    try {
        const basketId = localStorage.getItem("basket_id");
        await axios.delete(`api/v1/baskets/${basketId}/items/${itemId}`);

        //updates the items list in the BasketReducer
        store.dispatch(removeFromBasket(itemId))
    } catch (e) {
        console.log(e)
    } finally {
    }
};