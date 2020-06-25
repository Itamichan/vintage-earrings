import React from 'react';
import {Button, Col, Container, Row} from 'reactstrap';
import {connect} from "react-redux";
import {withRouter} from "react-router";
import BasketItem from "./BasketItem";
import {removeItem} from "./basketOperations";
import "./Basket.scss";
import {isBrowser, isMobile, isTablet} from "react-device-detect";

const Basket = ({showItemsCount, showItemsTotal, basketItems, history}) => {


    let itemsList = basketItems.map(item => {
        return (
            <Col xs={"12"} key={item.id}>
                <BasketItem
                    item={item}
                    onTrashClick={() => removeItem(item.id)}
                />
            </Col>
        )
    });

    return (
        <Container id={'basket-container'} className={'start-point'}>
            {showItemsCount > 0 ? (
                <div>
                    <Row>
                        <Col className={'basket-heading'}>
                            <div>
                                <span>Total ({showItemsCount} </span>
                                {
                                    showItemsCount > 1 ? (
                                        <span>items):</span>
                                    ) : (
                                        <span>item):</span>)}
                            </div>
                        </Col>
                        <Col className={'basket-heading'}>
                            <div>
                                {showItemsTotal} €
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {itemsList}
                    </Row>
                    <Row>
                        <div id={'button-area'}>
                            {isBrowser &&
                            <Col id={'checkout-button'}>
                                <Button
                                    onClick={() => history.push(`/checkout`)}
                                    className={'action-button '}
                                >
                                    Proceed to checkout
                                </Button>
                            </Col>}
                            {isMobile || isTablet ?
                                <Col id={'checkout-button-mobile'}>
                                    <Button
                                        onClick={() => history.push(`/checkout`)}
                                        className={'action-button'}
                                    >
                                        Proceed to checkout
                                    </Button>
                                </Col> : null}
                        </div>
                    </Row>
                </div>
            ) : (
                <Row>
                    <Col xs={12}>
                        <div>
                            You have no items in your basket
                        </div>
                    </Col>
                </Row>
            )}
        </Container>
    )
};

//dispatch will move the provided action dict (result of login(token))
// to the global state and will run the reducer with the provided action
const mapDispatchToProps = (dispatch) => {
    return {}
};

//map the global state to properties that are passed into the comp
const mapStateToProps = (state) => {
    return {
        basketItems: state.BasketReducer.basketItems
    }
};

//next line ensures that the properties from the 2 passed functions are passed to Login comp
const DefaultApp = withRouter(connect(mapStateToProps, mapDispatchToProps)(Basket));
export default DefaultApp;