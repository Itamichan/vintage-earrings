import React, {useEffect, useState} from 'react';
import "./UserAccount.scss";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {Col, Container, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AddressForm from "../../AddressForm/AddressForm";

const UserAccount = ({isUserLoggedIn, userId}) => {

    const [addresses, setAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);

    const loadAddresses = async () => {
        if (userId) {
            const {data} = await axios.get(`/api/v1/user/${userId}/all_addresses/`, {});
            setAddresses(data.address_list);
        } else {
            setAddresses([])
        }
    };

    const deleteAddress = async (addressId) => {
        await axios.delete(`/api/v1/user/${userId}/address/${addressId}/`);
        loadAddresses()
    };

    useEffect(() => {
        loadAddresses()
    }, [userId]);

    let addressList = addresses.map(address => {
        return (
            <div key={address.id} className={'material-frame address-instance'}>
                <div id={'close-icon'}
                     onClick={() => deleteAddress(address.id)}
                >
                    <FontAwesomeIcon icon="times"/>
                </div>
                <div>{` ${address.first_name} ${address.last_name}`}</div>
                <div>{address.street}</div>
                <div>{address.apt_nr}</div>
                <div>{address.zip_code}</div>
                <div>{address.city}</div>
                <div>{address.country}</div>
            </div>
        )
    });

    //renders component only for logged in users
    if (!isUserLoggedIn) {
        return null
    }
    return (
        <div>
            <Container id={'account-container'} className={"start-point"}>
                <Row>
                    <Col className={'text-header-standard'}>
                        <div> Your Addresses</div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div id={'add-address-container'} className={'material-frame text-highlight'}
                             onClick={() => setShowAddressForm(true)}
                        >
                            <p>
                                Add new Address
                            </p>
                            <FontAwesomeIcon size={"2x"} icon="plus"/>
                        </div>
                    </Col>
                    <Col xs={12} id={'address-container'}>
                        {addressList}
                    </Col>
                </Row>
            </Container>
            {showAddressForm &&
            <Modal isOpen={showAddressForm}
                   centered={true}
                   size={'lg'}
                   id={'addresses-create-modal'}
            >
                <ModalHeader
                    toggle={() => {
                        setShowAddressForm(false)
                    }}>
                    <div className={'text-header-standard'}>Choose an Address</div>
                </ModalHeader>
                <ModalBody id={'address-container'}>
                    <AddressForm
                        hideAddressForm={() => setShowAddressForm(false)}
                        updateShownAddresses={() => loadAddresses()}
                    />
                </ModalBody>
            </Modal>
            }
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
        isUserLoggedIn: state.LoginReducer.loggedIn,
        userId: state.LoginReducer.id,
    }
};

//next line ensures that the properties from the 2 passed functions are passed to Login comp
const DefaultApp = withRouter(connect(mapStateToProps, mapDispatchToProps)(UserAccount));
export default DefaultApp;