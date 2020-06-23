import React from 'react';
import {Card, CardBody, CardImg, CardText, CardTitle} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./ProductCard.scss"
import {withRouter} from "react-router";

const ProductCard = ({product, onShoppingCartClick, history}) => {


    return (
        <div className={"material-frame"}>
            <Card className={"card"}>
                <CardImg
                    className={"card-img"}
                    top width="100%"
                    src={product["photos"][0].photo_url}
                    alt="img of the product"
                    onClick={() => history.push({
                        pathname: `/products/product/${product.id}`,
                        state: {
                            product: product
                        }
                    })}
                />
                <CardBody>
                    <CardTitle
                        className={"text-header-standard card-title"}
                        onClick={() => history.push({
                            pathname: `/products/product/${product.id}`,
                            state: {
                                product: product
                            }
                        })}
                    >
                        {product.name}
                    </CardTitle>
                    {/*shows the price and the cart only if the onShoppingCartClick property had received a value */}
                    {onShoppingCartClick &&
                    <CardText className={"text-highlight card-text"}>
                        {`${product.price} €`}
                        <FontAwesomeIcon
                            icon="cart-plus"
                            onClick={() => onShoppingCartClick()}
                            className={'cart-plus'}
                        />
                    </CardText>
                    }
                </CardBody>
            </Card>
        </div>
    );
};

export default withRouter(ProductCard);