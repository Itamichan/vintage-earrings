import {store} from "../../store";
import axios from "axios";
import {addToBasket} from "./redux/actions";


export const addProduct = async (productId) => {

    let basketId = localStorage.getItem("basket_id");

    //before adding a product to the basket it ensures that the basket exists.
    if (!basketId) {
        let {data} = await axios.post(`api/v1/baskets/`);
        localStorage.setItem("basket_id", data.basket_id);
        basketId = data.basket_id
    }

    let {data} = await axios.post(`api/v1/baskets/${basketId}/items/`, {
        'product_id': productId
    });
    store.dispatch(addToBasket(data))
};