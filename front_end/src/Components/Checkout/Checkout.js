import React, {useState} from 'react';
import {Button, Col, Container, Label, ModalBody, Row} from "reactstrap";
import {AvField, AvForm} from "availity-reactstrap-validation";
import {withRouter} from "react-router";

const Checkout = ({history}) => {

    const [sendingRequest, setSendingRequest] = useState(false);
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [aptNr, setAptNr] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');

    return (
        <Container className={'start-point'}>
            <Row>
                <Col>
                    Provide delivery address
                </Col>
            </Row>
            <Row>
                <Col xs={4}>
                    <AvForm onValidSubmit={() => history.push('/')}>
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