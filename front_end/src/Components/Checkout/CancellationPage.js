import React from 'react';
import {Button, Col, Container, Row} from "reactstrap";
import {withRouter} from "react-router";
import "./CancellationPage.scss";

const CancellationPage = ({history}) => {
    return (
        <Container className={'start-point'} id={'cancellation-page-container'}>
            <Row>
                <Col xs={12} className={'text-header-important'}>
                    Your checkout process is cancelled.
                </Col>
            </Row>
            <Row>
                <Col id={'option-buttons'} xs={12}>
                    <Row>
                        <Col xs={12} md={6}>
                            <Button
                                onClick={() => history.push('/products')}
                                className={'action-button'}
                            >
                                Shop
                            </Button>
                        </Col>
                        <Col xs={12} md={6}>
                            <Button
                                onClick={() => history.push('/basket')}
                                className={'action-button'}
                            >
                                Basket
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
};

export default withRouter(CancellationPage);