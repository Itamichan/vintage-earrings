import React, {useEffect, useState} from 'react';
import {Button, Spinner} from "reactstrap";
import axios from "axios";
import {useParams, withRouter} from "react-router";
import {removeBasket} from "../Basket/basketOperations";
import "./SuccessPage.scss";

const SuccessPage = ({history}) => {

    const [sendingRequest, setSendingRequest] = useState(true);
    const [paymentResponse, setPaymentResponse] = useState('');

    let params = useParams();
    const basketId = params.basketId;

    const checkPayment = async () => {
        try {

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
        checkPayment();
    }, []);


    return (
        <div id={'success-page-container'} className={'start-point'}>
            {sendingRequest ? (
                <Spinner color="secondary"/>
            ) : (
                <div>
                    {paymentResponse === 'Your order is created.' ? (
                        <div>
                            <div>
                                {paymentResponse}
                            </div>
                            <div>
                                <Button className={'action-button'}
                                        onClick={() => history.push('/products')}
                                >
                                    Continue shopping
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div>
                                {paymentResponse}
                                <p>
                                    Please contact us if you have any questions.
                                </p>
                            </div>
                            <div>
                                <Button className={'action-button'}
                                        onClick={() => history.push('/contact')}
                                >
                                    Contact
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
};

export default withRouter(SuccessPage);