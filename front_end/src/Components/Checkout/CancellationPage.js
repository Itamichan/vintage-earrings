import React from 'react';
import {Button} from "reactstrap";
import {withRouter} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

//todo prettify the page
const CancellationPage = ({history}) => {
    return (
        <div className={'start-point'}>
            Your checkout process is cancelled.
            <div>
                Continue shopping:
                <Button onClick={() => history.push('/products')}>Shop Now!</Button>
            </div>
            <div>
                Go back to your basket:
                <div onClick={() => history.push("/basket")}>
                    <FontAwesomeIcon icon="shopping-cart"/>
                </div>
            </div>
        </div>
    )
};

export default withRouter(CancellationPage);