import React, {useEffect, useState} from 'react';
import {Spinner} from "reactstrap";
import axios from "axios";
import {useParams, withRouter} from "react-router";

const SuccessPage = (props) => {

    const [sendingRequest, setSendingRequest] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState('');

    let params = useParams();

    const checkPayment = async () => {
        try {
            setSendingRequest(true);

            const {data} = await axios.get(`/api/v1/baskets/${params.basketId}/payment/verify`,);

            setPaymentStatus(data.payment_status)
        } catch (e) {
            console.log(e)
        } finally {
            setSendingRequest(false)
        }

    };

    useEffect(() => {
        checkPayment()
    }, []);

    let paymentResponse;

    //rendering the adeqcvate feedback bases on stripe's PaymentIntent status
    switch (paymentStatus) {
        case  'succeeded':
            paymentResponse = 'Your order is created.';
            break;
        case  'requires_payment_method':
            paymentResponse = 'Your order requires payment method.';
            break;
        case  'canceled':
            paymentResponse = 'Your order was cancelled.';
            break;
        case  'processing':
            paymentResponse = 'Your order is under processing.';
            break;
        case  'requires_action':
            paymentResponse = 'Your order requires additional actions.';
            break;
        case  'requires_confirmation':
            paymentResponse = 'Your order requires confirmation.';
            break;
        default:
            paymentResponse = ' Payment failed. Please try again.'
    }

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