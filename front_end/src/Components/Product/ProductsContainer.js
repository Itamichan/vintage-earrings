import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Col, Container, Row, Spinner} from "reactstrap";
import ProductCard from "./ProductCard";
import ProductsPagination from "./ProductsPagination";

const ProductsContainer = (props) => {

    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);

    // puts the limit of how many products appear per page
    const PRODUCTS_PER_PAGE = 8;

    const loadProducts = async () => {
        try {
            const {data} = await axios.get('api/v1/products/');
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

    let productsList = products.map(product => {
        return (
            <Col xs={"6"} md={"4"} xl={"3"} className={"attraction-card"} key={product.id}>
                <ProductCard
                    cardId={product.id}
                    cardTitle={product.name}
                    productImgList={product["photos"]}
                    productPrice={`${product.price} €`}
                />
            </Col>
        )
    });

    //returns attractionsList with attractions for each corresponding page number.
    productsList = productsList.slice(PRODUCTS_PER_PAGE * (page - 1), PRODUCTS_PER_PAGE * page);

    return (
        <div className={"start-point"}>
            product's container
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
                                    {/*provides empty space that will be covered by the TripBanner*/}
                                    <div id={"buffer-div"}/>
                                </Col>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
};

export default ProductsContainer;