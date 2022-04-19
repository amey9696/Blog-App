import jwt_decode from "jwt-decode";
import { SET_LOADER, CLOSE_LOADER, SET_TOKEN, REGISTER_ERRORS, LOGIN_ERRORS, LOGOUT, FORGOT_PASSWORD_ERRORS, OTP_ERRORS, RESET_OTP_ERRORS, RESET_FORGOT_PASSWORD_ERRORS } from '../types/Usertypes';

const initialState = {
    loading: false,
    registerError: [],
    loginError: [],
    token: '',
    user: '',
    message: '',
    forgotPassErrors: [],
    otpErrors: [],
}

//storage token in localstorage and automatically delete after completed 7 days
const verifyToken = (token) => {
    const decodeToken = jwt_decode(token);
    // console.log(decodeToken);
    const expiresIn = new Date(decodeToken.exp * 1000);
    if (new Date() > expiresIn) {
        localStorage.removeItem('myToken');
        return null;
    } else {
        return decodeToken;
    }
}

const token = localStorage.getItem('myToken');
// console.log(token);
if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
        initialState.token = token;
        const { user } = decoded;
        initialState.user = user;
    }
}

const AuthReducer = (state = initialState, action) => {
    if (action.type === SET_LOADER) {
        return { ...state, loading: true }
    }
    else if (action.type === CLOSE_LOADER) {
        return { ...state, loading: false }
    }
    else if (action.type === REGISTER_ERRORS) {
        return { ...state, registerError: action.payload }
    }
    else if (action.type === LOGIN_ERRORS) {
        return { ...state, loginError: action.payload }
    }
    else if (action.type === SET_TOKEN) {
        const decoded = verifyToken(action.payload);
        const { user } = decoded;
        return { ...state, token: action.payload, user: user, loginError: [], registerError: [] }
    }
    else if (action.type === LOGOUT) {
        return { ...state, token: '', user: '' }
    }
    else if (action.type === FORGOT_PASSWORD_ERRORS) {
        return { ...state, forgotPassErrors: action.payload }
    }
    else if (action.type === RESET_FORGOT_PASSWORD_ERRORS) {
        return { ...state, forgotPassErrors: [] }
    }
    else if (action.type === OTP_ERRORS) {
        return { ...state, otpErrors: action.payload }
    }
    else if (action.type === RESET_OTP_ERRORS) {
        return { ...state, otpErrors: [] }
    }
    else {
        return state;
    }
}
export default AuthReducer;