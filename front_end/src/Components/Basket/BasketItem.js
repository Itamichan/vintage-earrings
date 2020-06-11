import React, {useState} from 'react';
import {Col, FormGroup, Input, Label, Media, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AvField, AvForm} from "availity-reactstrap-validation";
import {updateItem} from "./basketOperations";

const BasketItem = ({cardTitle, itemImgList, itemPrice, itemQuantity, onTrashClick, idemId}) => {

    const [sendingRequest, setSendingRequest] = useState(false);

    const updateItemQuantity = (newQuantity) => {
        try {
            setSendingRequest(true);
            updateItem(idemId, newQuantity)

        } catch (e) {
            console.log(e)

        } finally {
            setSendingRequest(false);
        }

    };

    console.log('itemQty:', itemQuantity);
    return (
        <Media className={"media-container"}>
            <Media
                left
                className={"media-img"}
                object
                src={itemImgList[0].photo_url}
                alt="attraction image"
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
                                    {cardTitle}
                                </Media>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={"2"}>
                                <FormGroup>
                                    <Label for="itemQty">Quantity</Label>
                                    <Input type="select" name="itemQty" label="Quantity" id="itemQty"
                                             value={itemQuantity} disabled={sendingRequest}
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
                        {itemPrice}
                    </Col>
                </Row>
            </Media>
        </Media>
    )
};

export default BasketItem;