import React from 'react';
import "./StartPage.scss";
import {Button, Label, Modal, ModalBody, ModalHeader} from "reactstrap";
import {withRouter} from "react-router";
import "./StartPage.scss";

const StartPage = ({history}) => {
    return (
        <div id={"start-container"} className={"start-point"}>
            <section id={'hero-img'}>
                <div id={'img-container'}/>
                <div id={'shop-button'}>
                    <Button onClick={() => history.push('/products')}>Shop Now!</Button>
                </div>
            </section>

        </div>
    )
};

export default withRouter(StartPage);