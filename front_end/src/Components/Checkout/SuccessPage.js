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

    return (
        <div>
            {sendingRequest ? (
                <Spinner color="danger"/>
            ) : (
                <div className={'start-point'}>
                    {paymentStatus === 'succeeded' ? (
                        <div>
                            order is created
                        </div>
                    ) : (
                        <div>
                            payment failed
                        </div>
                    )}
                </div>
            )}
        </div>
    )
};

export default withRouter(SuccessPage);