import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {closeModal, login} from "./redux/actions";
import {connect} from "react-redux";
import {
    Button,
    FormGroup,
    FormText,
    Input,
    Label,
    Modal,
    ButtonGroup,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "reactstrap";
import {notify} from 'react-notify-toast';
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
                <FormGroup>
                    <Label for="email" className={"text-highlight"}>Email</Label>
                    <Input disabled={sendingRequest} type="email" name="email" id="email" value={email}
                           onChange={(e) => setEmail(e.target.value)}/>
                </FormGroup>
                <FormGroup>
                    <Label for="password" className={"text-highlight"}>Password</Label>
                    <Input disabled={sendingRequest} type="password" id={'password'} name={'password'}
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                    {
                        registerUser &&
                        <FormText>At least 8 characters.</FormText>
                    }
                </FormGroup>
                {
                    !registerUser &&
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
                }
            </ModalBody>
            <ModalFooter id={"login-footer"}>
                {registerUser &&
                <Button
                    disabled={sendingRequest}
                    className={"neutral-button"}
                    onClick={() => setRegisterUser(false)}
                >
                    Go back
                </Button>}
                <Button
                    disabled={sendingRequest}
                    className={"action-button"}
                    onClick={registerUser ? register : login}
                >
                    Submit
                </Button>
            </ModalFooter>
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