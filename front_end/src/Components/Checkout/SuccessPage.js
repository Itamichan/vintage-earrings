import React, {useEffect, useState} from 'react';
import {Spinner} from "reactstrap";
import axios from "axios";

const SuccessPage = (props) => {

    const [sendingRequest, setSendingRequest] = useState(true);

    const checkPayment = async () => {
        try {
            //todo got basket_id from the url route
            const basketId = localStorage.getItem('basket_id');
            setSendingRequest(true);
            await axios.get(`api/v1/${basketId}/payment/verify`,)

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
                    order created
                </div>
            )}
        </div>
    )
};

export default SuccessPage;