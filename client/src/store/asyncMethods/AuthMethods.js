import axios from 'axios';
import { SET_LOADER, CLOSE_LOADER, SET_TOKEN, REGISTER_ERRORS,LOGIN_ERRORS, FORGOT_PASSWORD_ERRORS, OTP_ERRORS, RESET_OTP_ERRORS, RESET_FORGOT_PASSWORD_ERRORS } from '../types/Usertypes';
import { REDIRECT_TRUE,SET_MESSAGE, REMOVE_MESSAGE  } from '../types/PostTypes';

export const postRegister = (state) => {
    return async (dispatch) => {
        const config = {
            headers: {
                'Content-type': 'application/json',
            },
        };
        dispatch({ type: SET_LOADER });
        try {
            const { data } = await axios.post('http://localhost:8000/register', state, config);
            // const { data } = await axios.post('https://heroku-blog-server-app.herokuapp.com/register', state, config);
            dispatch({ type: CLOSE_LOADER });
            // console.log(data);
            localStorage.setItem('myToken', data.token);
            dispatch({ type: SET_TOKEN, payload: data.token });
            dispatch({ type: SET_MESSAGE, payload: data.msg });
        } catch (error) {
            dispatch({ type: CLOSE_LOADER });
            dispatch({ type: REGISTER_ERRORS, payload: error.response.data.errors });
            // console.log(error.response);
        }
    }
}

export const postLogin=(state)=>{
    return async (dispatch)=>{
        const config = {
            headers: {
                'Content-type': 'application/json',
            },
        };
        dispatch({ type: SET_LOADER });
        try {
            const { data } = await axios.post('http://localhost:8000/login', state, config);
            // const { data } = await axios.post('https://heroku-blog-server-app.herokuapp.com/login', state, config);
            dispatch({ type: CLOSE_LOADER });
            localStorage.setItem('myToken', data.token);
            dispatch({ type: SET_TOKEN, payload: data.token });
            dispatch({ type: SET_MESSAGE, payload: data.msg });
        } catch (error) {
            dispatch({ type: CLOSE_LOADER });
            dispatch({ type: LOGIN_ERRORS, payload: error.response.data.errors });
            // console.log(error.response);
        }
    }
}

export const emailSend=(state)=>{
    return async (dispatch)=>{
        const config = {
            headers: {
                'Content-type': 'application/json',
            },
        };
        dispatch({ type: SET_LOADER });
        try {
            const { data:{msg} } = await axios.post('http://localhost:8000/forgotPassword', state, config);
            // const { data:{msg} } = await axios.post('https://heroku-blog-server-app.herokuapp.com/forgotPassword', state, config);
            // console.log(data);
            dispatch({ type: CLOSE_LOADER });
            dispatch({ type: RESET_FORGOT_PASSWORD_ERRORS });
            dispatch({ type: REDIRECT_TRUE });
            dispatch({ type: SET_MESSAGE, payload: msg });
        } catch (error) {
            dispatch({ type: CLOSE_LOADER });
            dispatch({ type: FORGOT_PASSWORD_ERRORS, payload: error.response.data.errors });
            // console.log(error.response);
        }
    }
}

export const changePassword=(state)=>{
    return async (dispatch)=>{
        const config = {
            headers: {
                'Content-type': 'application/json',
            },
        };
        dispatch({ type: SET_LOADER });
        try {
            const { data: { msg } } = await axios.post('http://localhost:8000/enterOtp', state, config);
            // const { data } = await axios.post('https://heroku-blog-server-app.herokuapp.com/enterOtp', state, config);
            console.log(msg);
            dispatch({ type: CLOSE_LOADER });
            // localStorage.setItem('myToken', data.token);
            // dispatch({ type: SET_TOKEN, payload: data.token });
            dispatch({ type: RESET_OTP_ERRORS });
            dispatch({ type: REDIRECT_TRUE });
            dispatch({ type: SET_MESSAGE, payload: msg });
        } catch (error) {
            dispatch({ type: CLOSE_LOADER });
            dispatch({ type: OTP_ERRORS, payload: error.response.data.errors });
            // console.log(error.response);
        }
    }
}