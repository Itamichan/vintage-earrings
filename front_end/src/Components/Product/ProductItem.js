import React, {useState} from 'react';
import {useLocation, useParams, withRouter} from "react-router";
import {
    Button,
    Carousel,
    CarouselCaption,
    CarouselControl,
    CarouselIndicators,
    CarouselItem,
    Container
} from 'reactstrap';
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import './ProductItem.scss';
import {addItem, updateItem} from "../Basket/basketOperations";
import {connect} from "react-redux";


const ProductItem = ({basketItems}) => {

    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    //Accesses parameters passed to the component
    let location = useLocation();
    const product = location.state.product;

    const productId = useParams().productId;

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
        <div className={'start-point'}>
            <Container fluid={true} id={'product-container'}>
                <Row>
                    <Col>
                        <Carousel
                            activeIndex={activeIndex}
                            next={next}
                            previous={previous}
                            interval={false}
                        >
                            <CarouselIndicators items={photoList} activeIndex={activeIndex} onClickHandler={goToIndex}/>
                            {slides}
                            <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous}/>
                            <CarouselControl direction="next" directionText="Next" onClickHandler={next}/>
                        </Carousel>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div>
                            {product.name}
                        </div>
                    </Col>
                    <Col xs={12}>
                        <Button
                            className={'action-button'}
                            onClick={() => manageItem(productId)}
                        >
                            Add to Basket
                        </Button>
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
const DefaultApp = withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductItem));
export default DefaultApp;