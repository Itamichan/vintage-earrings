import React, {useEffect, useState} from 'react';
import "./StartPage.scss";
import {Button, Col, Container, Row, Spinner} from "reactstrap";
import {withRouter} from "react-router";
import {BrowserView, MobileView} from "react-device-detect";
import axios from "axios";
import ProductCard from "../Product/ProductCard";

const StartPage = ({history}) => {

    const [loading, setLoading] = useState(true);
    const [latestProducts, setLatestProducts] = useState([]);

    const loadLatestProducts = async () => {
        try {
            const {data} = await axios.get('api/v1/products/latest/');
            setLatestProducts(data.latestProducts)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }
    };

    let latestProductsList = latestProducts.map(product => {
        return (
            <Col xs={"6"} md={"4"} xl={"3"} key={product.id}>
                <ProductCard
                    product={product}
                />
            </Col>
        )
    });

    //load latestProducts one time after the first rendering
    useEffect(() => {
        loadLatestProducts()
    }, []);

    return (
        <div id={"start-container"} className={"start-point"}>
            <section id={'hero-container'}>
                <div id={'img-container'}/>
                <div id={'img-header'}>
                    <div className={'text-header'} id={'hero-header'}>
                        Find your perfect pair...
                    </div>
                </div>
                <Button
                    id={'shop-button'}
                    className={'neutral-button'}
                    onClick={() => history.push('/products')}
                >
                    Shop Now!
                </Button>
            </section>
            <section id={'logo-text-section'}>
                <Container fluid={true} id={'logo-text-container'}>
                    <Row>
                        <Col>
                            <BrowserView>
                                <div className={'text-header-important'}>
                                    Here we offer unique style earrings for the unique person you are!
                                </div>
                            </BrowserView>
                            <MobileView>
                                <div className={'text-header-important'}>
                                    Unique style earrings for you!
                                </div>
                            </MobileView>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section id={'products-preview'}>
                <Container>
                    <Row>
                        <Col xs={12} className={'text-header'}>
                            Latest additions:
                        </Col>
                        {loading ? (
                            <Col>
                                <Spinner color="danger"/>
                            </Col>
                        ) : (
                            <Col>
                                <Row>
                                    {latestProductsList}
                                </Row>
                            </Col>
                        )}
                    </Row>
                </Container>

            </section>
        </div>
    )
};

export default withRouter(StartPage);