import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {closeModal, login} from "./redux/actions";
import {connect} from "react-redux";
import {Button, FormGroup, FormText, Input, Label, Modal, ModalBody, ModalHeader, FormFeedback} from "reactstrap";
import {notify} from 'react-notify-toast';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AvForm, AvField} from 'availity-reactstrap-validation';
import "./Login.scss";

const Login = ({loginUser, isModalOpen, closeModal}) => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [registerUser, setRegisterUser] = useState(false);
    const [sendingRequest, setSendingRequest] = useState(false);

    const register = async () => {
        try {
            setSendingRequest(true);
            await axios.post('/api/v1/users', {
                'password': password,
                'email': email
            });
            notify.show('yay!!', "success", 1700);
            login();
        } catch (e) {
            switch (e.response.data.error) {
                case "InvalidPassword":
                    notify.show('Invalid Password!', "error", 1700);
                    break;
                case "UnavailableUsername":
                    notify.show('Unavailable Username!', "error", 1700);
                    break;
                case "InvalidEmailFormat":
                    notify.show('Invalid Email Format!', "error", 1700);
                    break;
                default:
                    break;
            }

        } finally {
            setSendingRequest(false);
        }
    };

    const login = async () => {
        try {
            setSendingRequest(true);
            const {data} = await axios.post('/api/v1/token', {
                'email': email,
                'password': password
            });
            loginUser(data.token, data.user_info)
        } catch (e) {
            console.log(e)
        } finally {
            setSendingRequest(false);
        }

    };

    //to clear the input fields if the user re-opens the modal or moves from login view to registration
    useEffect(() => {
        setPassword("");
        setEmail("");
    }, [registerUser, isModalOpen]);

    //change the button text in the Login/Registration Modal
    let toggleButtonName;

    if (registerUser) {
        toggleButtonName =
            <div>
                <FontAwesomeIcon
                    icon="user-plus"
                />
                <span>Create account</span>
            </div>
    } else {
        toggleButtonName =
            <div>
                <FontAwesomeIcon
                    icon="sign-in-alt"
                />
                <span>Log in</span>
            </div>
    }

    console.log(`email: ${email}`)

    return (
        <Modal isOpen={isModalOpen}>
            <ModalHeader
                toggle={() => {
                    closeModal();
                    setRegisterUser(false)
                }}>
                <div className={"text-header"}>
                    {registerUser ? "Register" : "Login"}
                </div>
            </ModalHeader>
            <ModalBody>
                <AvForm onSubmit={registerUser ? register : login}>
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
                    <Label for="password" className={"text-highlight"}>Password</Label>
                    <AvField type="password" id={'password'} name={'password'} value={password}
                             errorMessage="Please provide a password."
                             disabled={sendingRequest}
                             validate={{
                                 required: {value: true},
                                 minLength: {
                                     value: 8,
                                     errorMessage: 'Your password should be at least 8 characters long.'
                                 },
                             }}
                             onChange={(e) => setPassword(e.target.value)}/>
                    {
                        registerUser &&
                        <FormText>At least 8 characters.</FormText>
                    }
                    <Button
                        disabled={sendingRequest}
                        className={"auth-button"}
                    >
                        {toggleButtonName}
                    </Button>
                </AvForm>
                {
                    registerUser ?
                        (
                            <div className={"text-highlight"}>
                                <span>
                                  Already have an account?
                                </span>
                                <button
                                    onClick={() => setRegisterUser(false)}
                                    disabled={sendingRequest}
                                    className={"link-button"}
                                >
                                    Log in
                                </button>
                            </div>
                        ) : (
                            <div className={"text-highlight"}>
                                <span>
                                    No account?
                                </span>
                                <button
                                    onClick={() => setRegisterUser(true)}
                                    disabled={sendingRequest}
                                    className={"link-button"}
                                >
                                    Create a new account
                                </button>
                            </div>
                        )
                }
            </ModalBody>
        </Modal>
    )
};


//dispatch will move the provided action dict (result of login(token))
// to the global state and will run the reducer with the provided action
const mapDispatchToProps = (dispatch) => {
    return {
        loginUser: (token, userInfo) => dispatch(login(token, userInfo)),
        closeModal: () => dispatch(closeModal())
    }
};

//map the global state to properties that are passed into the comp
const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.LoginReducer.loggedIn,
        isModalOpen: state.LoginReducer.modalOpen
    }
};

//next line ensures that the properties from the 2 passed functions are passed to Login comp
const DefaultApp = connect(mapStateToProps, mapDispatchToProps)(Login);
export default DefaultApp;