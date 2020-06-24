import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Col, Container, Input, Row, Spinner} from "reactstrap";
import ProductCard from "./ProductCard";
import ProductsPagination from "./ProductsPagination";
import {addItem, updateItem} from "../Basket/basketOperations";
import {connect} from "react-redux";
import "./ProductsContainer.scss";

const ProductsContainer = ({basketItems}) => {

    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState(null);

    const [page, setPage] = useState(1);

    // puts the limit of how many products appear per page
    const PRODUCTS_PER_PAGE = 8;

    const loadProducts = async () => {
        try {
            const {data} = await axios.get('/api/v1/products/', {
                params: {
                    product_name: productName
                }
            });
            setProducts(data.products)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }
    };


    //load Products one time after the first rendering
    useEffect(() => {
        loadProducts()
    }, []);

    useEffect(() => {
        loadProducts()
    }, [productName]);

    //responsible for adding a new item to the basket or updating the quantity of an existing item.
    let manageItem = (productId) => {
        //this filter can create a list with only one element
        let basketItem = basketItems.filter(item => {
            return item.product.id === productId
        });

        if (basketItem.length === 0) {
            addItem(productId)
        } else {
            updateItem(basketItem[0].id, basketItem[0].items_quantity + 1)
        }
    };

    let productsList = products.map(product => {
        return (
            <Col xs={"6"} md={"4"} xl={"3"} key={product.id}>
                <ProductCard
                    product={product}
                    onShoppingCartClick={() => manageItem(product.id)}
                />
            </Col>
        )
    });

    //returns attractionsList with attractions for each corresponding page number.
    productsList = productsList.slice(PRODUCTS_PER_PAGE * (page - 1), PRODUCTS_PER_PAGE * page);

    const searchProduct = (searchWord) => {
        setProductName(searchWord)
    };

    const searchInput = <Input
        type="search"
        placeholder={"Search"}
        onChange={(event) => {
            searchProduct(event.target.value)
        }}
    />;

    return (
        <div className={"start-point"}>
            <Container id={"products-container"} fluid={true}>
                <Row>
                    <Col>
                        <Row>
                            {loading ? (
                                <Col>
                                    <Spinner color="danger"/>
                                </Col>
                            ) : (
                                <Col>
                                    <Row>
                                        <Col>
                                            <div id={"search-desktop"}>
                                                {searchInput}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        {productsList}
                                    </Row>
                                    <Row>
                                        <Col>
                                            <ProductsPagination
                                                currentPage={page}
                                                setCurrentPage={setPage}
                                                ItemsPerPage={PRODUCTS_PER_PAGE}
                                                totalItemsNr={products.length}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            )}
                        </Row>
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
        basketItems: state.BasketReducer.basketItems,
    }
};

//next line ensures that the properties from the 2 passed functions are passed to Login comp
const DefaultApp = connect(mapStateToProps, mapDispatchToProps)(ProductsContainer);
export default DefaultApp;