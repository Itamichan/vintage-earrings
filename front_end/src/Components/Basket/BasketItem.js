import React, {useState} from 'react';
import {Col, FormGroup, Input, Label, Media, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {updateItem} from "./basketOperations";
import "./BasketItem.scss";
import {withRouter} from "react-router";

const BasketItem = ({history, item, onTrashClick}) => {

    const [sendingRequest, setSendingRequest] = useState(false);

    const updateItemQuantity = (newQuantity) => {
        try {
            setSendingRequest(true);
            updateItem(item.id, newQuantity)

        } catch (e) {
            console.log(e)

        } finally {
            setSendingRequest(false);
        }

    };

    return (
        <Media className={"media-container"}>
            <Media
                left
                className={"media-img"}
                object
                src={item.product.photos[0].photo_url}
                alt="product image"
                onClick={() => history.push({
                    pathname: `/products/product/${item.product.id}`,
                    state: {
                        productImgList: item.product.photos,
                        productPrice: `${item.product.price} €`,
                        productDescription: item.product.description,
                        productName: item.product.name,
                        productQty: item.product.quantity
                    }
                })}
            >
            </Media>
            <Media body className={"media-body"}>
                <Row>
                    <Col
                        xs={"10"}
                        className={"attraction-info-body text-highlight"}
                    >
                        <Row>
                            <Col>
                                <Media heading className={"text-header media-heading"}>
                                    {item.product.name}
                                </Media>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={"2"}>
                                <FormGroup>
                                    <Label for="itemQty">Quantity</Label>
                                    <Input type="select" name="itemQty" label="Quantity" id="itemQty"
                                             value={item.items_quantity} disabled={sendingRequest}
                                             onChange={(e) => updateItemQuantity(parseInt(e.target.value))}
                                    >
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                        <option>7</option>
                                        <option>8</option>
                                        <option>9</option>
                                        <option>10</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div onClick={() => onTrashClick()}>
                                    <FontAwesomeIcon size={"2x"} icon={['far', 'trash-alt']}/>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={"2"}>
                        {`${item.product.price} €`}
                    </Col>
                </Row>
            </Media>
        </Media>
    )
};

export default withRouter(BasketItem);