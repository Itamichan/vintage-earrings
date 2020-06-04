import React from 'react';
import {Card, CardBody, CardImg, CardText, CardTitle} from "reactstrap";

const ProductCard = ({
                         cardTitle, cardImg, productPrice, cardId
                     }) => {


    return (
        <div className={"attraction-container material-frame"}>
            <Card className={"card"} >
                <CardImg
                    className={"card-img"}
                    top width="100%"
                    src={cardImg}
                    alt="img of the attraction"
                />
                <CardBody>
                    <CardTitle className={"text-header"}>{cardTitle}</CardTitle>
                    <CardText className={"text-highlight"}>{productPrice}</CardText>
                </CardBody>
            </Card>
        </div>
    );
};

export default ProductCard;