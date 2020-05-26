import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {closeModal, login} from "./redux/actions";
import {connect} from "react-redux";
import {Button, FormGroup, FormText, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {notify} from 'react-notify-toast';
import "./Login.scss";

const Login = ({loginUser, isModalOpen, closeModal}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [registerUser, setRegisterUser] = useState(false);
    const [sendingPostRequest, setSendingPostRequest] = useState(false);

    const register = async () => {
        try {
            setSendingPostRequest(true);
            await axios.post('/api/v1/users', {
                'username': username,
                'password': password,
                'email': email
            });
            notify.show('yay!!', "success", 1700);
            login();
        } catch (e) {
            switch (e.response.data.error) {
                case "InvalidUsername":
                    notify.show('Invalid Username!', "error", 1700);
                    break;
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
            setSendingPostRequest(false);
        }
    };

    const login = async () => {
        try {
            setSendingPostRequest(true);
            const {data} = await axios.post('/api/v1/token', {
                'username': username,
                'password': password
            });
            loginUser(data.token, data.user_info)
        } catch (e) {
            console.log(e)
        } finally {
            setSendingPostRequest(false);
        }

    };

    useEffect(() => {
        setUsername("");
        setPassword("");
        setEmail("");
    }, [registerUser, isModalOpen]);


    return (
        <Modal isOpen={isModalOpen}>
            <ModalHeader>
                <div className={"text-header"}>
                    {registerUser ? "Register" : "Login"}
                </div>
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label for="username" className={"text-highlight"}>Username</Label>
                    <Input disabled={sendingPostRequest} type="text" id={'username'} name={'username'} value={username}
                           onChange={(e) => setUsername(e.target.value)}/>
                    <FormText>At least 2 characters.</FormText>
                </FormGroup>
                <FormGroup>
                    <Label for="password" className={"text-highlight"}>Password</Label>
                    <Input disabled={sendingPostRequest} type="password" id={'password'} name={'password'}
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                    <FormText>At least 8 characters.</FormText>
                </FormGroup>
                {
                    registerUser ? (
                        <FormGroup>
                            <Label for="email" className={"text-highlight"}>Email</Label>
                            <Input disabled={sendingPostRequest} type="email" name="email" id="email" value={email}
                                   onChange={(e) => setEmail(e.target.value)}/>
                        </FormGroup>
                    ) : (
                        <FormGroup>
                            <h1 className={"text-highlight-important"}>Not registered?</h1>
                            <Button disabled={sendingPostRequest} className={"action-button"}
                                    onClick={() => setRegisterUser(true)}>Register now!
                            </Button>
                        </FormGroup>
                    )
                }
            </ModalBody>
            <ModalFooter id={"login-footer"}>
                {registerUser &&
                <Button
                    disabled={sendingPostRequest}
                    className={"neutral-button"}
                    onClick={() => setRegisterUser(false)}
                >
                    Go back
                </Button>}
                <Button
                    disabled={sendingPostRequest}
                    className={"neutral-button"}
                    onClick={() => {
                        closeModal();
                        setRegisterUser(false)
                    }}
                >
                    Cancel
                </Button>
                <Button
                    disabled={sendingPostRequest}
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