import React from 'react';
import "./StartPage.scss";
import {Button, Col, Container, Label, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {withRouter} from "react-router";
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import "./StartPage.scss";

const StartPage = ({history}) => {
    return (
        <div id={"start-container"} className={"start-point"}>
            <section id={'hero-container'}>
                <div id={'img-container'}/>
                <div id={'img-header'}>
                    <div className={'text-header'} id={'hero-header'}>
                        Find your perfect pair...
                    </div>
                </div>
                <Button
                    id={'shop-button'}
                    className={'neutral-button'}
                    onClick={() => history.push('/products')}
                >
                    Shop Now!
                </Button>
            </section>
            <section id={'logo-text-section'}>
                <Container fluid={true} id={'logo-text-container'}>
                    <Row>
                        <Col>
                            <BrowserView>
                                <div className={'text-header-important'}>
                                    Here we offer unique style earrings for the unique person you are!
                                </div>
                            </BrowserView>
                            <MobileView>
                                <div className={'text-header-important'}>
                                    Unique style earrings for you!
                                </div>
                            </MobileView>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    )
};

export default withRouter(StartPage);