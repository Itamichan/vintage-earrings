import React, {useState} from 'react';
import {withRouter} from "react-router";
import axios from "axios";
import {notify} from "react-notify-toast";
import {loadStripe} from '@stripe/stripe-js';
import {connect} from "react-redux";
import AddressForm from "../AddressForm/AddressForm";
import "./Checkout.scss";

const Checkout = ({userId, userEmail}) => {

    const [executingCheckout, setExecutingCheckout] = useState(false);

    const stripePromise = loadStripe('pk_test_HOdcOxCrsy4Yyhic9468ZiDc00Ar5VIhOY');


    const checkout = async (email) => {
        try {
            setExecutingCheckout(true);
            const basketId = localStorage.getItem('basket_id');

            const {data} = await axios.post(`/api/v1/baskets/${basketId}/checkout`, {
                "email": email
            });

            const sessionId = data.sessionId;

            const stripe = await stripePromise;
            const {error} = await stripe.redirectToCheckout({
                sessionId,
            });
            if (error) {
                console.log(error.message)
            }
            notify.show('yay!!', "success", 1700);
        } catch (e) {
            console.log(e)

        } finally {
            setExecutingCheckout(false);
        }
    };

    return (
        <section id={'checkout-section'}  className={'start-point'}>
            <AddressForm
                checkout={(email) => checkout(email)}
                executingCheckout={executingCheckout}
            />
        </section>
    )
};

//dispatch will move the provided action dict (result of login(token))
// to the global state and will run the reducer with the provided action
const mapDispatchToProps = (dispatch) => {
    return {}
};

//map the global state to properties that are passed into the comp
const mapStateToProps = (state) => {
    return {
        userId: state.LoginReducer.id,
        userEmail: state.LoginReducer.email
    }
};

//next line ensures that the properties from the 2 passed functions are passed to Login comp
const DefaultApp = withRouter(connect(mapStateToProps, mapDispatchToProps)(Checkout));
export default DefaultApp;