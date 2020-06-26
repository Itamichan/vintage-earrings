import React from 'react';
import "./Footer.scss";
import {Col, Container, Row} from "reactstrap";
import {withRouter} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Footer = ({history}) => {
    return (
        <footer id={'footer-section'}>
            <Container fluid={true} id={'footer-container'}>
                <Row>
                    <Col xs={6} className={'info-section'}>
                        <Row>
                            <Col className={'text-header-highlight footer-header'}>
                                Navigation
                            </Col>
                        </Row>
                        <Row>
                            <Col id={'footer-navigation-links'} className={'text-default'}>
                                <ul>
                                    <li
                                        className={'footer-font'}
                                        onClick={() => history.push("/products")}>
                                        Shop
                                    </li>
                                    <li
                                        className={'footer-font'}
                                        onClick={() => history.push("/contact")}>
                                        Contact
                                    </li>
                                    <li
                                        className={'footer-font'}
                                        onClick={() => history.push("/account")}>
                                        Account
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={6} className={'info-section'}>
                        <Row>
                            <Col className={'text-header-highlight'}>
                                Social Media
                            </Col>
                        </Row>
                        <Row>
                            <Col id={"footer-social-links"}>
                                <ul>
                                    <li>
                                        <a href="https://github.com/Itamichan/vintage-earrings"
                                           rel='noreferrer noopener'
                                           target="_blank"
                                           className={'text-default footer-font'}
                                        >
                                            <FontAwesomeIcon size={"lg"} icon={['fab', 'github']}/>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://instagram.com/"
                                           rel='noreferrer noopener'
                                           target="_blank"
                                           className={'text-default footer-font'}
                                        >
                                            <FontAwesomeIcon size={"lg"} icon={['fab', 'instagram']}/>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.facebook.com/"
                                           rel='noreferrer noopener'
                                           target="_blank"
                                           className={'text-default footer-font'}
                                        >
                                            <FontAwesomeIcon size={"lg"} icon={['fab', 'facebook']}/>
                                        </a>
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
};

export default withRouter(Footer);