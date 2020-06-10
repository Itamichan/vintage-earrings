import {store} from "../../store";
import axios from "axios";
import {addToBasket, updateBasket} from "./redux/actions";


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

export const UpdateItem = async (productId, itemQuantity) => {
    try {
        let basketId = localStorage.getItem("basket_id");
        await axios.patch(`api/v1/baskets/${basketId}/items/${productId}`, {
            'quantity': itemQuantity
        });

        //updates the quantity of the item in the BasketReducer
        store.dispatch(updateBasket(productId, itemQuantity))
    } catch (e) {
        console.log(e)
    } finally {
    }
};