import React, {useState} from 'react';
import {Button, Col, Container, Label, ModalBody, Row} from "reactstrap";
import {AvField, AvForm} from "availity-reactstrap-validation";
import {withRouter, useParams} from "react-router";
import axios from "axios";
import {notify} from "react-notify-toast";
import {loadStripe} from '@stripe/stripe-js';

const Checkout = ({history}) => {

    const [sendingRequest, setSendingRequest] = useState(false);
    const [email, setEmail] = useState('cris@gmail.com');
    const [confirmEmail, setConfirmEmail] = useState('cris@gmail.com');
    const [firstName, setFirstName] = useState('cris');
    const [lastName, setLastName] = useState('garb');
    const [streetAddress, setStreetAddress] = useState('fff');
    const [aptNr, setAptNr] = useState('ff');
    const [postalCode, setPostalCode] = useState('fgfg');
    const [city, setCity] = useState('kista');
    const [country, setCountry] = useState('Sweden');

    const stripePromise = loadStripe('pk_test_HOdcOxCrsy4Yyhic9468ZiDc00Ar5VIhOY');

    const checkout = async () => {
        try {
            setSendingRequest(true);
            const basketId = localStorage.getItem('basket_id');

            const {data} = await axios.post(`api/v1/baskets/${basketId}/checkout`, {
                'email': email,
                'confirmEmail': confirmEmail,
                'firstName': firstName,
                'lastName': lastName,
                'streetAddress': streetAddress,
                'aptNr': aptNr,
                'postalCode': postalCode,
                'city': city,
                'country': country
            });

            const sessionId = data.sessionId;
            const stripe = await stripePromise;
            const {error} = await stripe.redirectToCheckout({
                sessionId,
            });
            if (error) {
                console.log(error.message)
            }
            notify.show('yay!!', "success", 1700);
        } catch (e) {
            console.log(e)

        } finally {
            setSendingRequest(false);
        }
    };

    // todo implement proper validation to all fields
    return (
        <Container className={'start-point'}>
            <Row>
                <Col>
                    Provide delivery address
                </Col>
            </Row>
            <Row>
                <Col xs={4}>
                    <AvForm onValidSubmit={() => checkout()}>
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
                        <Label for="confirmEmail" className={"text-highlight"}>Confirm Email</Label>
                        <AvField type="email" id={'confirmEmail'} name={'confirmEmail'} value={confirmEmail}
                                 errorMessage="Please provide the email."
                                 disabled={sendingRequest}
                                 validate={{
                                     required: {value: true},
                                     match: {
                                         value: 'email',
                                         errorMessage: 'Please provide a matching email'
                                     }
                                 }}
                                 onChange={(e) => setConfirmEmail(e.target.value)}/>
                        <Label for="firstName" className={"text-highlight"}>First Name</Label>
                        <AvField type="text" id={'firstName'} name={'firstName'} value={firstName}
                                 errorMessage="Please provide the email."
                                 disabled={sendingRequest}
                                 validate={{
                                     required: {value: true}
                                 }}
                                 onChange={(e) => setFirstName(e.target.value)}/>
                        <Label for="lastName" className={"text-highlight"}>Last Name</Label>
                        <AvField type="text" id={'lastName'} name={'lastName'} value={lastName}
                                 errorMessage="Please provide the email."
                                 disabled={sendingRequest}
                                 validate={{
                                     required: {value: true}
                                 }}
                                 onChange={(e) => setLastName(e.target.value)}/>
                        <Label for="streetAddress" className={"text-highlight"}>Street Address</Label>
                        <AvField type="text" id={'streetAddress'} name={'streetAddress'} value={streetAddress}
                                 errorMessage="Please provide the email."
                                 disabled={sendingRequest}
                                 validate={{
                                     required: {value: true}
                                 }}
                                 onChange={(e) => setStreetAddress(e.target.value)}/>
                        <Label for="aptNr" className={"text-highlight"}>aptNr</Label>
                        <AvField type="text" id={'aptNr'} name={'aptNr'} value={aptNr}
                                 errorMessage="Please provide the email."
                                 disabled={sendingRequest}
                                 validate={{
                                     required: {value: true}
                                 }}
                                 onChange={(e) => setAptNr(e.target.value)}/>
                        <Label for="postalCode" className={"text-highlight"}>postal Code</Label>
                        <AvField type="text" id={'postalCode'} name={'postalCode'} value={postalCode}
                                 errorMessage="Please provide the email."
                                 disabled={sendingRequest}
                                 validate={{
                                     required: {value: true}
                                 }}
                                 onChange={(e) => setPostalCode(e.target.value)}/>
                        <Label for="city" className={"text-highlight"}>city</Label>
                        <AvField type="text" id={'city'} name={'city'} value={city}
                                 errorMessage="Please provide the email."
                                 disabled={sendingRequest}
                                 validate={{
                                     required: {value: true}
                                 }}
                                 onChange={(e) => setCity(e.target.value)}/>
                        <Label for="country" className={"text-highlight"}>country</Label>
                        <AvField type="text" id={'country'} name={'country'} value={country}
                                 errorMessage="Please provide the email."
                                 disabled={sendingRequest}
                                 validate={{
                                     required: {value: true}
                                 }}
                                 onChange={(e) => setCountry(e.target.value)}/>
                        <Button
                            disabled={sendingRequest}
                            className={"auth-button"}
                        >
                            Proceed to Payment
                        </Button>
                    </AvForm>
                </Col>
            </Row>
        </Container>
    )
};

export default withRouter(Checkout);