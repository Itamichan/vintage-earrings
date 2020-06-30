import React, {useEffect, useState} from 'react';
import {useLocation, useParams, withRouter} from "react-router";
import {Button, Carousel, CarouselControl, CarouselIndicators, CarouselItem, Container} from 'reactstrap';
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import './ProductItem.scss';
import {addItem, updateItem} from "../Basket/basketOperations";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";


const ProductItem = ({basketItems, history}) => {

    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [product, setProduct] = useState(undefined);

    const productId = useParams().productId;

    useEffect(() => {
        loadProduct()
    }, []);

    const loadProduct = async () => {
        try {
            const {data} = await axios.get('/api/v1/products/', {
                params: {
                    product_id: productId
                }
            });
            setProduct(data.products[0])
        } catch (e) {
            console.log(e)
        }
    };

    //responsible for adding a new item to the basket or updating the quantity of an existing item.
    let manageItem = (productId) => {
        //this filter can create a list with only one element
        let basketItem = basketItems.filter(item => {
            return item.product.id === parseInt(productId)
        });

        if (basketItem.length === 0) {
            addItem(productId)
        } else {
            updateItem(basketItem[0].id, basketItem[0].items_quantity + 1)
        }
    };

    //reactstrap code for the carousel
    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === photoList.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    };

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? photoList.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    };

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    };

    if (!product) {
        return <div className={'start-point'} id={'load-screen'}> Loading</div>
    }

    const photoList = product.photos.map(img => {
        return {
            id: img.id,
            src: img.photo_url
        }
    });

    const slides = photoList.map((photo) => {
        return (
            <CarouselItem
                className={'carousel-item'}
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={photo.id}
            >
                <img src={photo.src}/>
            </CarouselItem>
        );
    });

    return (
        <section className={'start-point'} id={'product-section'}>
            <Container id={'product-container'}>
                <Row>
                    <Col
                        className={'button-wrapper'}
                        onClick={() => history.goBack()}
                    >
                        <span>
                            <FontAwesomeIcon icon="chevron-left"/>
                        </span>
                        <Button className={'invisible-button back-button'}>
                            Go back to the shop
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col className={'item-img-carousel'} xs={12} md={8}>
                        <Carousel
                            activeIndex={activeIndex}
                            next={next}
                            previous={previous}
                            interval={false}
                        >
                            <CarouselIndicators
                                items={photoList}
                                activeIndex={activeIndex}
                                onClickHandler={goToIndex}
                            />
                            {slides}
                            <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous}/>
                            <CarouselControl direction="next" directionText="Next" onClickHandler={next}/>
                        </Carousel>
                    </Col>
                    <Col id={'product-main-info'} xs={12} md={4}>
                        <Row>
                            <Col xs={12}>
                                <div className={'text-header-standard'}>
                                    {product.name}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <div className={'text-highlight'}>
                                    {`${product.price} €`}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Button
                                    className={'action-button'}
                                    id={'add-button'}
                                    onClick={() => manageItem(productId)}
                                >
                                    Add to Basket
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col id={'product-description'}>
                        <div>
                            <h1 className={'text-header-standard'}>Description:</h1>
                            <p className={'text-default'} id={'description-text'}>
                                {product.description}
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
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
const DefaultApp = withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductItem));
export default DefaultApp;