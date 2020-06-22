import React from 'react';
import "./Footer.scss";
import {Col, Container, Row} from "reactstrap";

const Footer = (props) => {
    return (
        <footer id={'footer-section'}>
            <Container>
                <Row>
                    <Col>
                        Footer
                    </Col>
                </Row>
            </Container>
        </footer>
    )
};

export default Footer;