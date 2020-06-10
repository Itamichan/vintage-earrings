import React from 'react';
import {Col, Container, Row} from 'reactstrap';
import {connect} from "react-redux";
import {withRouter} from "react-router";

const Basket = ({showItemsCount, showItemsTotal, basketItems}) => {

    let itemsList = basketItems.map(item => {
        return (
            <Col xs={"12"} key={item.id}>
                <BasketItem
                    cardTitle={item.name}
                    itemImgList={item["photos"]}
                    itemPrice={`${item.price} €`}
                    itemQuantity={item.items_quantity}
                />
            </Col>
        )
    });

    return (
        <div className={'start-point'}>
            basket
            <Container>
                <Row>
                    <Col>
                        <div>
                            Total ({showItemsCount} items):
                        </div>

                    </Col>
                    <Col>
                        <div>
                            {showItemsTotal} €
                        </div>
                    </Col>
                </Row>
                <Row>
                    {itemsList}
                </Row>
            </Container>
        </div>
    )
};

//dispatch will move the provided action dict (result of login(token))
// to the global state and will run the reducer with the provided action
const mapDispatchToProps = (dispatch) => {
    return {

    }
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