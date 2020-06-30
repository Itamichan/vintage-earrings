import React, {useState} from 'react';
import {Button, Col, Container, Modal, ModalBody, ModalHeader, Row} from 'reactstrap';
import {connect} from "react-redux";
import {withRouter} from "react-router";
import BasketItem from "./BasketItem";
import {removeItem} from "./basketOperations";
import "./Basket.scss";
import {isBrowser, isMobile, isTablet} from "react-device-detect";
import {checkoutBasket, openModal} from "../UserProfile/Login/redux/actions";

const Basket = ({showItemsCount, showItemsTotal, basketItems, history, openLoginModal, checkoutBasket, isUserLoggedIn}) => {

    const [showCheckoutOption, setShowCheckoutOption] = useState(false);

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

    let checkoutStep = () => {
        if (isUserLoggedIn) {
            history.push(`/checkout`);
        } else {
            setShowCheckoutOption(true)
        }
    } ;

    return (
        <div>
            <Container id={'basket-container'} className={'start-point'}>
                {showItemsCount > 0 ? (
                    <div>
                        <Row>
                            <div className={'button-area'}>
                                {isBrowser &&
                                <Col>
                                    <Button
                                        onClick={checkoutStep}
                                        className={'action-button '}
                                    >
                                        Proceed to checkout
                                    </Button>
                                </Col>}
                            </div>
                        </Row>
                        <Row>
                            <Col className={'basket-heading text-header-important'}>
                                <Row>
                                    <Col xs={6}>
                                        <div>
                                            <span>Total ({showItemsCount} </span>
                                            {
                                                showItemsCount > 1 ? (
                                                    <span>items):</span>
                                                ) : (
                                                    <span>item):</span>)}
                                        </div>
                                    </Col>
                                    <Col xs={6} id={'heading-total'}>
                                        <div>
                                            {showItemsTotal} €
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col id={'items-container'}>
                                <Row>
                                    {itemsList}
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <div className={'button-area'}>
                                {isBrowser &&
                                <Col>
                                    <Button
                                        onClick={checkoutStep}
                                        className={'action-button '}
                                    >
                                        Proceed to checkout
                                    </Button>
                                </Col>}
                                {isMobile || isTablet ?
                                    <Col id={'checkout-button-mobile'}>
                                        <Button
                                            onClick={checkoutStep}
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
                        <Col xs={12} id={'empty-basket'}>
                            <div className={'text-header-standard'}>
                                You have no items in your basket
                            </div>
                        </Col>
                    </Row>
                )}
            </Container>
            {showCheckoutOption &&
            <Modal isOpen={showCheckoutOption} centered={true}>
                <ModalHeader
                    toggle={() => {
                        setShowCheckoutOption(false)
                    }}>
                </ModalHeader>
                <ModalBody id={'checkout-choice'}>
                    <div id={'login-button'}>
                        <Button className={'action-button'} onClick={() => {
                            openLoginModal();
                            checkoutBasket();
                            setShowCheckoutOption(false)
                        }}
                        >
                            Login
                        </Button>
                    </div>
                    <div>
                        <button className={'invisible-button'}
                                onClick={() => {
                                    history.push(`/checkout`);
                                    setShowCheckoutOption(false)
                                }}
                        >
                            Skip this step for now
                        </button>
                    </div>
                </ModalBody>
            </Modal>
            }
        </div>
    )
};

//dispatch will move the provided action dict (result of login(token))
// to the global state and will run the reducer with the provided action
const mapDispatchToProps = (dispatch) => {
    return {
        openLoginModal: () => dispatch(openModal()),
        checkoutBasket: () => dispatch(checkoutBasket())
    }
};

//map the global state to properties that are passed into the comp
const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.LoginReducer.loggedIn,
        basketItems: state.BasketReducer.basketItems
    }
};

//next line ensures that the properties from the 2 passed functions are passed to Login comp
const DefaultApp = withRouter(connect(mapStateToProps, mapDispatchToProps)(Basket));
export default DefaultApp;