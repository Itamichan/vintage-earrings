import React from 'react';
import "./StartPage.scss";
import {Button, Label, Modal, ModalBody, ModalHeader} from "reactstrap";
import {withRouter} from "react-router";
import "./StartPage.scss";

const StartPage = ({history}) => {
    return (
        <div id={"start-container"} className={"start-point"}>
            <section id={'hero-container'}>
                <div id={'img-container'}/>
                <div id={'img-header'}>
                    <h1 className={'text-header'} id={'hero-header'}>
                        Find your perfect pair...
                    </h1>
                </div>
                <Button
                    id={'shop-button'}
                    className={'neutral-button'}
                    onClick={() => history.push('/products')}
                >
                    Shop Now!
                </Button>
            </section>

        </div>
    )
};

export default withRouter(StartPage);