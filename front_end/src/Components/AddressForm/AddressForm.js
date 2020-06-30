import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Label, Modal, ModalBody, ModalHeader, Row, Spinner} from "reactstrap";
import {AvField, AvForm} from "availity-reactstrap-validation";
import axios from "axios";
import {notify} from "react-notify-toast";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import "./AddressForm.scss";
import ProductCard from "../Product/ProductCard";

const AddressForm = ({executingCheckout, checkout, userId, userEmail}) => {
//todo clean the dummy data
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [aptNr, setAptNr] = useState();
    const [postalCode, setPostalCode] = useState();
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');

    const [sendingRequest, setSendingRequest] = useState(false);
    const [loading, setLoading] = useState(true);

    const [showAddresses, setShowAddresses] = useState(false);
    const [addresses, setAddresses] = useState([]);


    //code inspired from https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
    const capitalizeWord = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1)
    };

    const storeAddress = async () => {
        if (userId) {
            try {
                setSendingRequest(true);

                await axios.post(`/api/v1/user/${userId}/address/`, {
                    'first_name': capitalizeWord(firstName),
                    'last_name': capitalizeWord(lastName),
                    'street_address': streetAddress,
                    'apt_nr': aptNr,
                    'postal_code': postalCode,
                    'city': capitalizeWord(city),
                    'country': capitalizeWord(country)
                });

            } catch (e) {
                switch (e.response.data.error) {
                    case "AddressNotProvided":
                        notify.show('No address is provided!', "error", 1700);
                        break;
                    case "UserDoesNotExist":
                        notify.show('Such user does not exist', "error", 1700);
                        break;
                    default:
                        break;
                }
            } finally {
                setSendingRequest(false);
            }
        }
    };

    const loadAddresses = async () => {
        if (userId) {
            try {
                const {data} = await axios.get(`/api/v1/user/${userId}/addresses/`, {});

                setAddresses(data.address_list)

            } catch {
            } finally {

            }
        }
    };

    let addressList = addresses.map(address => {
        return (
            <Col xs={"6"} md={"4"} xl={"3"} key={address.id}>
                <AddressCard
                    address={address}
                />
            </Col>
        )
    });

    const retrieveLatestAddress = async () => {
        if (userId) {
            try {
                setLoading(true);

                const {data} = await axios.get(`/api/v1/user/${userId}/address/`, {});

                //checks that the values are assigned only if an address is returned by the api endpoint.
                if (data) {
                    setEmail(userEmail);
                    setConfirmEmail(userEmail);
                    setFirstName(capitalizeWord(data.address.first_name));
                    setLastName(capitalizeWord(data.address.last_name));
                    setStreetAddress(data.address.street);
                    setAptNr(data.address.apt_nr);
                    setPostalCode(data.address.zip_code);
                    setCity(capitalizeWord(data.address.city));
                    setCountry(capitalizeWord(data.address.country));
                }

            } catch {
            } finally {
                setLoading(false);
            }
        } else {
            setEmail('');
            setConfirmEmail('');
            setFirstName('');
            setLastName('');
            setStreetAddress('');
            setAptNr();
            setPostalCode();
            setCity('');
            setCountry('')
        }
    };

    useEffect(() => {
        retrieveLatestAddress(userId)
    }, [userId]);


    return (
        <section id={'address-section'} className={'start-point'}>
            {loading && userId ? (
                    <div id={'spinner'}>
                        <Spinner color="secondary"/>
                    </div>
                ) :
                (<Container>
                    {addressList.length > 0 &&

                    <Row>
                        <Col id={'choose-address-button'}>
                            <Button
                                className={'action-button'}
                                onClick={() => {
                                    setShowAddresses(true);
                                    loadAddresses()
                                }}
                            >
                                Change Address
                            </Button>
                        </Col>
                    </Row>
                    }
                    <Row>
                        <Col id={'address-header'} className={'text-header-standard'}>
                            <div>
                                Please provide the delivery address
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={{offset: 2, size: 8}}>
                            <AvForm onValidSubmit={() => {
                                storeAddress();
                                if (checkout) {
                                    checkout(email)
                                }
                            }}>
                                <Row>
                                    <Col xs={12}>
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
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <Label for="confirmEmail" className={"text-highlight"}>Confirm Email</Label>
                                        <AvField type="email" id={'confirmEmail'} name={'confirmEmail'}
                                                 value={confirmEmail}
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
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6}>
                                        <Label for="firstName" className={"text-highlight"}>First Name</Label>
                                        <AvField type="text" id={'firstName'} name={'firstName'} value={firstName}
                                                 errorMessage="Please provide the First Name."
                                                 disabled={sendingRequest}
                                                 validate={{
                                                     required: {value: true},
                                                     pattern: {
                                                         value: '^[A-Za-z]+$',
                                                         errorMessage: "Only letter characters are allowed."
                                                     },
                                                     maxLength: {
                                                         value: 40,
                                                         errorMessage: "Maximum 40 characters are allowed."
                                                     }
                                                 }}
                                                 onChange={(e) => setFirstName(e.target.value)}/>
                                    </Col>
                                    <Col xs={6}>
                                        <Label for="lastName" className={"text-highlight"}>Last Name</Label>
                                        <AvField type="text" id={'lastName'} name={'lastName'} value={lastName}
                                                 errorMessage="Please provide the Last Name."
                                                 disabled={sendingRequest}
                                                 validate={{
                                                     required: {value: true},
                                                     pattern: {
                                                         value: '^[A-Za-z]+$',
                                                         errorMessage: "Only letter characters are allowed."
                                                     },
                                                     maxLength: {
                                                         value: 40,
                                                         errorMessage: "Maximum 40 characters are allowed."
                                                     }
                                                 }}
                                                 onChange={(e) => setLastName(e.target.value)}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} lg={6}>
                                        <Label for="streetAddress" className={"text-highlight"}>Street Address</Label>
                                        <AvField type="text" id={'streetAddress'} name={'streetAddress'}
                                                 value={streetAddress}
                                                 errorMessage="Please provide the street address."
                                                 disabled={sendingRequest}
                                                 validate={{
                                                     required: {value: true},
                                                     maxLength: {
                                                         value: 40,
                                                         errorMessage: "Maximum 40 characters are allowed."
                                                     }
                                                 }}
                                                 onChange={(e) => setStreetAddress(e.target.value)}/>
                                    </Col>
                                    <Col xs={6} lg={3}>
                                        <Label for="aptNr" className={"text-highlight"}>Apartment Nr.</Label>
                                        <AvField type="number" id={'aptNr'} name={'aptNr'} value={aptNr}
                                                 errorMessage="Please provide the apartment number."
                                                 disabled={sendingRequest}
                                                 validate={{
                                                     required: {value: true},
                                                     pattern: {
                                                         value: '^[0-9]+$',
                                                         errorMessage: "Only numerical characters are allowed."
                                                     }
                                                 }}
                                                 onChange={(e) => setAptNr(e.target.value)}/>
                                    </Col>
                                    <Col xs={6} lg={3}>
                                        <Label for="postalCode" className={"text-highlight"}>Postal Code</Label>
                                        <AvField type="number" id={'postalCode'} name={'postalCode'} value={postalCode}
                                                 errorMessage="Please provide the email."
                                                 disabled={sendingRequest}
                                                 validate={{
                                                     required: {value: true},
                                                     pattern: {
                                                         value: '^[0-9]+$',
                                                         errorMessage: "Only numerical characters are allowed."
                                                     }
                                                 }}
                                                 onChange={(e) => setPostalCode(e.target.value)}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Label for="city" className={"text-highlight"}>City</Label>
                                        <AvField type="text" id={'city'} name={'city'} value={city}
                                                 errorMessage="Please provide the email."
                                                 disabled={sendingRequest}
                                                 validate={{
                                                     required: {value: true},
                                                     pattern: {
                                                         value: '^[A-Za-z]+$',
                                                         errorMessage: "Only letter characters are allowed."
                                                     },
                                                     maxLength: {
                                                         value: 40,
                                                         errorMessage: "Maximum 40 characters are allowed."
                                                     }
                                                 }}
                                                 onChange={(e) => setCity(e.target.value)}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Label for="country" className={"text-highlight"}>Country</Label>
                                        <AvField type="text" id={'country'} name={'country'} value={country}
                                                 errorMessage="Please provide the email."
                                                 disabled={sendingRequest}
                                                 validate={{
                                                     required: {value: true},
                                                     pattern: {
                                                         value: '^[A-Za-z]+$',
                                                         errorMessage: "Only letter characters are allowed."
                                                     },
                                                     maxLength: {
                                                         value: 40,
                                                         errorMessage: "Maximum 40 characters are allowed."
                                                     }
                                                 }}
                                                 onChange={(e) => setCountry(e.target.value)}/>
                                    </Col>
                                </Row>
                                {checkout ? (
                                    <Button
                                        disabled={executingCheckout}
                                        className={"auth-button"}
                                    >
                                        Proceed to Payment
                                    </Button>
                                ) : (
                                    <Button
                                        disabled={sendingRequest}
                                        className={"auth-button"}
                                    >
                                        Save
                                    </Button>
                                )}
                            </AvForm>
                        </Col>
                    </Row>
                </Container>)
            }
            {showAddresses &&
            <Modal isOpen={showAddresses}
                   centered={true}
                   id={'addresses-modal'}
            >
                <ModalHeader
                    toggle={() => {
                        setShowAddresses(false)
                    }}>
                    <div className={'text-header-standard'}>Choose an Address</div>
                </ModalHeader>
                <ModalBody id={'checkout-choice'}>

                </ModalBody>
            </Modal>}
        </section>)
};

//dispatch will move the provided action dict (result of login(token))
// to the global state and will run the reducer with the provided action
const mapDispatchToProps = (dispatch) => {
    return {}
};

//map the global state to properties that are passed into the comp
const mapStateToProps = (state) => {
    return {
        userId: state.LoginReducer.id,
        userEmail: state.LoginReducer.email
    }
};

//next line ensures that the properties from the 2 passed functions are passed to Login comp
const DefaultApp = withRouter(connect(mapStateToProps, mapDispatchToProps)(AddressForm));
export default DefaultApp;