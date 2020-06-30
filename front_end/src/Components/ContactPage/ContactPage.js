import React, {useRef, useState} from 'react';
import {Button, Col, Container, Label, Row} from "reactstrap";
import {AvField, AvForm} from "availity-reactstrap-validation";
import axios from "axios";
import {notify} from "react-notify-toast";
import "./ContactPage.scss";

const ContactPage = (props) => {

    const [sendingRequest, setSendingRequest] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const formRef = useRef();

    const contactSupport = async () => {
        try {
            setSendingRequest(true);
            await axios.post(`/api/v1/user/contact/`, {
                    email: email,
                    name: name,
                    message: message
                }
            );
            notify.show('Thank you for your message!', "success", 1700);
            formRef.current.reset()

        } catch (e) {
        } finally {
            setSendingRequest(false);
        }
    };

    return (
        <section id={'contact-page-section'} className={'start-point'}>
            <Container id={'contact-page-container'}>
                <Row>
                    <Col xs={12} md={{size: 6, offset: 3}}
                         className={'text-header-standard'}
                         id={'contact-header'}
                    >
                        Contact Us
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={{size: 6, offset: 3}}
                         id={'contact-body'}
                    >
                        <AvForm onValidSubmit={() => contactSupport()} ref={formRef}>
                            <Label for="email" className={"text-highlight"}>Email</Label>
                            <AvField type="email" name="email" id="email" value={email}
                                     errorMessage="Please provide an email."
                                     disabled={sendingRequest}
                                     validate={{
                                         required: {value: true},
                                         pattern: {
                                             value: '^([\\w\\.\\-]+)@([\\w]+)\\.([\\w]+){2,}$',
                                             errorMessage: 'Please provide a valid email.'
                                         }
                                     }}
                                     onChange={(e) => setEmail(e.target.value)}
                            />
                            <Label for="name" className={"text-highlight"}>Name</Label>
                            <AvField type="text" id={'name'} name={'name'} value={name}
                                     errorMessage="Please provide the First Name."
                                     disabled={sendingRequest}
                                     validate={{
                                         required: {value: true},
                                         pattern: {
                                             value: '^[A-Za-z ]+$',
                                             errorMessage: "Only letter characters are allowed."
                                         },
                                         maxLength: {
                                             value: 40,
                                             errorMessage: "Maximum 40 characters are allowed."
                                         }
                                     }}
                                     onChange={(e) => setName(e.target.value)}/>
                            <Label for="message" className={"text-highlight"}>Message</Label>
                            <AvField type="textarea" id={'message'} name={'message'} value={message}
                                     errorMessage="Please provide a message."
                                     disabled={sendingRequest}
                                     validate={{
                                         required: {value: true}
                                     }}
                                     onChange={(e) => setMessage(e.target.value)}/>
                            <Button
                                disabled={sendingRequest}
                                className={"auth-button"}
                            >
                                Send
                            </Button>
                        </AvForm>
                    </Col>
                </Row>
            </Container>
        </section>
    )
};

export default ContactPage;