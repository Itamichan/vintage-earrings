import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {closeModal, login} from "./redux/actions";
import {connect} from "react-redux";
import {Button, Label, Modal, ModalBody, ModalHeader} from "reactstrap";
import {notify} from 'react-notify-toast';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AvField, AvForm} from 'availity-reactstrap-validation';
import {withRouter} from "react-router";

const Login = ({loginUser, isModalOpen, closeModal, isCheckout, history}) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [registerUser, setRegisterUser] = useState(false);
    const [sendingRequest, setSendingRequest] = useState(false);
    const formRef = useRef();

    const register = async () => {
        try {
            setSendingRequest(true);

            await axios.post('/api/v1/registration', {
                'password': password,
                'email': email
            });
            login();
            formRef.current.reset()
        } catch (e) {
            switch (e.response.data.error) {
                case "InvalidPassword":
                    notify.show('Invalid Password!', "error", 1700);
                    break;
                case "InvalidEmail":
                    notify.show('Invalid Email Format!', "error", 1700);
                    break;
                case "UnavailableUsername":
                    notify.show('Please provide a different email', "error", 2500);
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
            const {data} = await axios.post('/api/v1/login/', {
                'username': email,
                'password': password
            });
            loginUser(data.token);
            {isCheckout && history.push(`/checkout`);}
            formRef.current.reset()
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
        setConfirmPassword("");
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

    return (
        <Modal isOpen={isModalOpen} centered={true}>
            <ModalHeader
                toggle={() => {
                    closeModal();
                    setRegisterUser(false)
                }}>
                <div className={"text-header-standard"}>
                    {registerUser ? "Register" : "Login"}
                </div>
            </ModalHeader>
            <ModalBody>
                <AvForm onValidSubmit={registerUser ? register : login}
                        ref={formRef}
                >
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
                             helpMessage={registerUser && "Your password must contain at least 8 characters."}
                             disabled={sendingRequest}
                             validate={{
                                 required: {value: true},
                                 minLength: {
                                     value: 8,
                                     errorMessage: 'Your password should be at least 8 characters long.'
                                 },
                             }}
                             onChange={(e) => setPassword(e.target.value)}/>
                    {registerUser &&
                    <div>
                        <Label for="confirmPassword" className={"text-highlight"}>Confirm Password</Label>
                        <AvField type="password" id={'confirmPassword'} name={'confirmPassword'} value={confirmPassword}
                                 errorMessage="Please provide the password."
                                 disabled={sendingRequest}
                                 validate={{
                                     required: {value: true},
                                     match: {
                                         value: 'password',
                                         errorMessage: 'Please provide a matching password'
                                     }
                                 }}
                                 onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </div>
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
                                    onClick={() => {
                                        formRef.current.reset();
                                        setRegisterUser(false)
                                    }}
                                    disabled={sendingRequest}
                                    className={"invisible-button"}
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
                                    onClick={() => {
                                        setRegisterUser(true)

                                    }}
                                    disabled={sendingRequest}
                                    className={"invisible-button"}
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
        loginUser: (token) => dispatch(login(token)),
        closeModal: () => dispatch(closeModal())
    }
};

//map the global state to properties that are passed into the comp
const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.LoginReducer.loggedIn,
        isModalOpen: state.LoginReducer.modalOpen,
        isCheckout: state.LoginReducer.checkout
    }
};

//next line ensures that the properties from the 2 passed functions are passed to Login comp
const DefaultApp = withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
export default DefaultApp;