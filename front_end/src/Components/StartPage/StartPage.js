import React from 'react';
import "./StartPage.scss";
import {Button, Label, Modal, ModalBody, ModalHeader} from "reactstrap";
import {withRouter} from "react-router";

const StartPage = ({history}) => {
    return (
        <div id={"start-container"} className={"start-point"}>
            start page
            <div style={{textAlign: 'center'}}>
                <Button onClick={() => history.push('/products')}>Shop Now!</Button>
            </div>
        </div>
    )
};

export default withRouter(StartPage);