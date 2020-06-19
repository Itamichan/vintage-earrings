import React from 'react';
import {Card, CardBody, CardImg, CardText, CardTitle} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./ProductCard.scss"
import {withRouter} from "react-router";

const ProductCard = ({
                         productName, productQty, productImgList, productPrice, onShoppingCartClick, productId, history,
                         productDescription
                     }) => {


    return (
        <div className={"material-frame"}>
            <Card className={"card"}>
                <CardImg
                    className={"card-img"}
                    top width="100%"
                    src={productImgList[0].photo_url}
                    alt="img of the product"
                    onClick={() => history.push({
                        pathname: `/products/product/${productId}`,
                        state: {
                            productImgList: productImgList,
                            productPrice: productPrice,
                            productDescription: productDescription,
                            productName: productName,
                            productQty: productQty
                        }
                    })}
                />
                <CardBody>
                    <CardTitle
                        className={"text-header"}
                        onClick={() => history.push({
                            pathname: `/products/product/${productId}`,
                            state: {
                                productImgList: productImgList,
                                productPrice: productPrice,
                                productDescription: productDescription,
                                productName: productName,
                                productQty: productQty
                            }
                        })}
                    >
                        {productName}
                    </CardTitle>
                    <CardText className={"text-highlight card-text"}>
                        {productPrice}
                        <FontAwesomeIcon
                            icon="cart-plus"
                            onClick={() => onShoppingCartClick()}
                            className={'cart-plus'}

                        />
                    </CardText>
                </CardBody>
            </Card>
        </div>
    );
};

export default withRouter(ProductCard);