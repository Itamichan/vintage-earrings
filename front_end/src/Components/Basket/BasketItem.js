import React from 'react';
import {Col, Container, Row, Spinner, Media} from "reactstrap";

const BasketItem = ({cardTitle, itemImgList, itemPrice, itemQuantity}) => {
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
                        <Media heading className={"text-header media-heading"}>
                            {cardTitle}
                        </Media>
                        <div>
                            Quantity: {itemQuantity}
                        </div>
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