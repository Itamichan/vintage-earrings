import React from "react";
import {store} from "../../store";
import axios from "axios";
import {addToBasket} from "./redux/actions";


export const addProduct = async ({product_id}) => {

    let basket_id = localStorage.getItem("basket_id");

    let createBasket = async () => {
        try {

            let {data} = await axios.get(`api/v1/baskets/`);
            //saving the basket it to the local storage
            localStorage.setItem("basket_id", data.basket_id)
        } catch (e) {

        } finally {
        }
    };

    let addProductToBasket = async (basket_id, product_id) => {
        try {

            let {data} = await axios.post(`api/v1/baskets/${basket_id}/items`, {
                'product_id': product_id
            });
            store.dispatch(addToBasket(data.item_info))
        } catch (e) {

        } finally {
        }
    };

    //before adding a product to the basket it ensures that the basket exists.
    if (!basket_id) {
        createBasket()
    }
    addProductToBasket(basket_id, product_id)
};