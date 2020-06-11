import React from 'react';
import {Button, Col, Container, Row} from 'reactstrap';
import {connect} from "react-redux";
import {withRouter} from "react-router";
import BasketItem from "./BasketItem";
import {removeItem} from "./basketOperations";

const Basket = ({showItemsCount, showItemsTotal, basketItems, history}) => {


    let itemsList = basketItems.map(item => {
        return (
            <Col xs={"12"} key={item.id}>
                <BasketItem
                    cardTitle={item.product.name}
                    idemId={item.id}
                    itemImgList={item.product.photos}
                    itemPrice={`${item.product.price} €`}
                    itemQuantity={item.items_quantity}
                    onTrashClick={() => removeItem(item.id)}
                />
            </Col>
        )
    });


    return (
        <div className={'start-point'}>
            basket
            <Container>
                {showItemsCount > 0? (
                    <Row>
                        <Col>
                            <div>
                                <span>Total ({showItemsCount} </span>
                                {
                                    showItemsCount > 1 ? (
                                        <span>items):</span>
                                    ) : (
                                        <span>item):</span>)}
                            </div>
                        </Col>
                        <Col>
                            <div>
                                {showItemsTotal} €
                            </div>
                        </Col>
                    </Row>
                ) : (
                    <Row>
                        <Col xs={12}>
                            <div>
                               You have no items in your basket
                            </div>
                        </Col>
                    </Row>
                )}
                <Row>
                    {itemsList}
                </Row>
                <Row>
                    <Col>
                        <Button onClick={() => history.push(`/checkout`)}>
                            Proceed to checkout
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
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