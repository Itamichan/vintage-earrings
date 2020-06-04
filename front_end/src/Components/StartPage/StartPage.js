import React from 'react';
import "./StartPage.scss";
import {Button, Label, Modal, ModalBody, ModalHeader} from "reactstrap";

const StartPage = (props) => {
    return (
        <div id={"start-container"} className={"start-point"}>
            start page
            <div  style={{textAlign: 'center'}}>
                <Button>Shop Now!</Button>
            </div>
        </div>
    )
};

export default StartPage;