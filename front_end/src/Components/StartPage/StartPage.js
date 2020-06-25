import React, {useEffect, useState} from 'react';
import "./StartPage.scss";
import {Button, Col, Container, Row, Spinner} from "reactstrap";
import {withRouter} from "react-router";
import {BrowserView, MobileView, isBrowser} from "react-device-detect";
import axios from "axios";
import ProductCard from "../Product/ProductCard";

const StartPage = ({history}) => {

    const [latestProducts, setLatestProducts] = useState([]);

    const loadLatestProducts = async () => {
        try {
            const {data} = await axios.get('/api/v1/products/latest/');
            setLatestProducts(data.latestProducts)
        } catch (e) {
            console.log(e)
        } finally {
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
        <div id={"start-container"}>
            <section id={'hero-section'}>
                <Container id={'hero-container'}>
                    <Row>
                        <Col>
                            {isBrowser ? (
                                <div className={'hero-area'}>
                                    <div id={'img-container'}/>
                                    <div className={'img-header'}>
                                        <div className={'text-header hero-header'}>
                                            Find your perfect pair...
                                        </div>
                                    </div>
                                    <Button
                                        className={'action-button shop-button'}
                                        onClick={() => history.push('/products')}
                                    >
                                        Shop Now!
                                    </Button>
                                </div>
                            ) : (
                                <div className={'hero-area'}>
                                    <div id={'img-container-mobile'}/>
                                    <div className={'img-header'}>
                                        <div className={'text-header hero-header'}>
                                            Find your perfect pair...
                                        </div>
                                    </div>
                                    <Button
                                        className={'action-button shop-button'}
                                        onClick={() => history.push('/products')}
                                    >
                                        Shop Now!
                                    </Button>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </section>
            <section id={'logo-text-section'}>
                <Container fluid={true} id={'logo-text-container'}>
                    <Row>
                        <Col id={'text-adv'}>
                            <BrowserView>
                                <div className={'text-header-important'}>
                                    Find the perfect vintage earrings which will enhance your unique style.
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
            <section id={'products-preview-section'}>
                <Container>
                    <Row>
                        <Col xs={12} className={'text-header-standard'}>
                            Latest additions:
                        </Col>
                        <Col>
                            <Row>
                                {latestProductsList}
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section id={'about-us-section'}>
                <Container id={'about-us-container'}>
                    <Row>
                        <Col xs={12} className={'text-header-important'} id={'logo-name'}>
                            VintageEarrings
                        </Col>
                    </Row>
                    <Row>
                        <Col className={'text-default'} id={'about-us-text'}>
                            <div>
                                <p>
                                    VintageEarrings is a web shop is for those of you who are logging for the style of
                                    the past days.
                                    We try to find the most unique and special patterns and make them available to you
                                    at a
                                    reasonable price.
                                </p>
                                <p>
                                    We hope that you will manage to find your exact perfect pair of earrings. If not,
                                    feel free to come again later. We are constantly updating our stores inventory.
                                </p>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button
                                className={'action-button'}
                                onClick={() => history.push('/contact')}
                            >
                                Contact Us
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    )
};

export default withRouter(StartPage);