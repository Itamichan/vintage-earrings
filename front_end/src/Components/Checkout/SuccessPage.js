import React, {useEffect, useState} from 'react';
import {Spinner} from "reactstrap";
import axios from "axios";
import {useParams, withRouter} from "react-router";
import {removeBasket} from "../Basket/basketOperations";

const SuccessPage = (props) => {

    const [sendingRequest, setSendingRequest] = useState(true);
    const [paymentResponse, setPaymentResponse] = useState('');

    let params = useParams();
    const basketId = params.basketId;


    const checkPayment = async () => {
        try {
            setSendingRequest(true);

            const {data} = await axios.get(`/api/v1/baskets/${basketId}/payment/verify`,);

            let paymentStatus = data.payment_status;

            if (paymentStatus === 'succeeded') {
                removeBasket()
            }

            //rendering the adequate feedback based on stripe's PaymentIntent status
            switch (paymentStatus) {
                case  'succeeded':
                    setPaymentResponse('Your order is created.');
                    break;
                case  'requires_payment_method':
                    setPaymentResponse('Your order requires payment method.');
                    break;
                case  'canceled':
                    setPaymentResponse('Your order was cancelled.');
                    break;
                case  'processing':
                    setPaymentResponse('Your order is under processing.');
                    break;
                case  'requires_action':
                    setPaymentResponse('Your order requires additional actions.');
                    break;
                case  'requires_confirmation':
                    setPaymentResponse('Your order requires confirmation.');
                    break;
                default:
                    setPaymentResponse(' Payment failed. Please try again.')
            }
        } catch (e) {
            console.log(e)
        } finally {
            setSendingRequest(false)
        }

    };

    useEffect(() => {
        checkPayment()
    }, []);


    return (
        <div>
            {sendingRequest ? (
                <Spinner color="danger"/>
            ) : (
                <div className={'start-point'}>
                    {paymentResponse}
                </div>
            )}
        </div>
    )
};

export default withRouter(SuccessPage);