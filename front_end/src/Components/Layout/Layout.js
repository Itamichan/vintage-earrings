import React, {useEffect, useState} from 'react';
import "./Layout.scss";
import Navigation from "../Navigation/Navigation";
import Login from "../UserProfile/Login/Login";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import axios from "axios";
import {login, logout} from "../UserProfile/Login/redux/actions";
import {connect} from "react-redux";
import Notifications from 'react-notify-toast';
import Spinner from "reactstrap/es/Spinner";
import UserAccount from "../UserProfile/UserAccount/UserAccount";
import StartPage from "../StartPage/StartPage";
import ProductsContainer from "../Product/ProductsContainer";
import {loadBasket} from "../Basket/redux/actions";
import Basket from "../Basket/Basket";

const Layout = ({loginUser, logout, loadBasket, basketItems}) => {

    const [loading, setLoading] = useState(true);

    const verifyUser = async () => {
        try {
            const token = localStorage.getItem("token");

            if (token) {
                await axios.post('/api/v1/token/verify', {
                    'token': token
                });
                loginUser(token);
            }
        } catch (e) {

        } finally {
            setLoading(false)
        }
    };

    const getBasketItems = async () => {
        try {
            const basketId = localStorage.getItem("basket_id");

            if (basketId) {
                const {data} = await axios.get(`/api/v1/baskets/${basketId}/items`);
                loadBasket(data.items)
            }
        } catch (e) {

        } finally {
        }
    };

    useEffect(() => {
        //the interceptor allows to pass the token information to all axios requests.
        axios.interceptors.request.use(
            function (config) {
                // Do something before request is sent
                const token = localStorage.getItem("token");
                if (token !== null && token !== undefined && token !== "" && token !== "null") {
                    config.headers.Authorization = 'JWT ' + token;
                }
                return config;
            },
            function (error) {
                // Do something with request error
                return Promise.reject(error);
            }
        );
        axios.interceptors.response.use(
            function (response) {
                // Do something with response data
                return response;
            },
            function (error) {
                // Logout if 401
                if (error.response && error.response.status === 401) {
                    // Unauthorized, bad token
                    logout();
                }
                return Promise.reject(error);
            }
        );
        verifyUser();
        getBasketItems()
    }, []);

    //calculating the total amount of items in the basket
    let itemsQuantity = basketItems.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.items_quantity
    }, 0);

    return (
        <div>
            {
                loading ? (
                    <div>
                        <Spinner color="danger"/>
                    </div>
                ) : (
                    <div>
                        <Notifications options={{zIndex: 10000, width: "100%"}}/>
                        <Router>
                            <Navigation ShowItemsCount = {itemsQuantity}/>
                            <Login/>
                            <Switch>
                                <Route path="/account">
                                    <UserAccount/>
                                </Route>
                                <Route path="/products">
                                    <ProductsContainer/>
                                </Route>
                                <Route path="/basket">
                                    <Basket/>
                                </Route>
                                <Route path="/">
                                    <StartPage/>
                                </Route>
                            </Switch>
                        </Router>
                    </div>
                )
            }
        </div>
    )
};

//dispatch will move the provided action dict (result of login(token))
// to the global state and will run the reducer with the provided action
const mapDispatchToProps = (dispatch) => {
    return {
        loginUser: (token) => dispatch(login(token)),
        logout: () => dispatch(logout()),
        loadBasket: (items) => dispatch(loadBasket(items))
    }
};

//map the global state to properties that are passed into the comp
const mapStateToProps = (state) => {
    return {
        basketItems: state.BasketReducer.basketItems,
    }
};

//next line ensures that the properties from the 2 passed functions are passed to Login comp
const DefaultApp = connect(mapStateToProps, mapDispatchToProps)(Layout);
export default DefaultApp;