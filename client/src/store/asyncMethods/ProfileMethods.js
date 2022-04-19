import axios from 'axios';
import { SET_LOADER, CLOSE_LOADER, REDIRECT_TRUE,SET_MESSAGE } from '../types/PostTypes';
import {SET_PROFILE_ERRORS,RESET_PROFILE_ERRORS} from '../types/ProfileType';
import {SET_TOKEN} from '../types/Usertypes';

export const updateNameAction=(user)=>{
    return async (dispatch, getState) => {
        const { AuthReducer: { token } } = getState();
        const config = {
            headers: { 
                Authorization: `${token}`
            }
        }
        dispatch({ type: SET_LOADER });
        try {
            const { data } = await axios.post('http://localhost:8000/updateName', user, config);
            // const { data } = await axios.post('https://heroku-blog-server-app.herokuapp.com/updateName', user, config);
            dispatch({ type: CLOSE_LOADER });
            localStorage.setItem('myToken', data.token);
            dispatch({ type: SET_TOKEN, payload: data.token });
            dispatch({ type: SET_MESSAGE, payload: data.msg });
            dispatch({ type: REDIRECT_TRUE });
            // console.log(data);
        } catch (error) {
            dispatch({ type: CLOSE_LOADER });
            // console.log(error.response.data.errors);
            dispatch({ type: SET_PROFILE_ERRORS, payload: error.response.data.errors});
        }
    }
}

export const updatePasswordAction=(userData)=>{
    return async (dispatch, getState) => {
        const { AuthReducer: { token } } = getState();
        const config = {
            headers: { 
                Authorization: `${token}`
            }
        }
        dispatch({ type: SET_LOADER });
        try {
            const { data } = await axios.post('http://localhost:8000/updatePassword', userData, config);
            // const { data } = await axios.post('https://heroku-blog-server-app.herokuapp.com/updatePassword', user, config);
            dispatch({ type: CLOSE_LOADER });
            dispatch({ type: SET_MESSAGE, payload: data.msg });
            dispatch({ type: REDIRECT_TRUE });
            // console.log(data);
        } catch (error) {
            dispatch({ type: CLOSE_LOADER });
            // console.log(error.response.data.errors);
            dispatch({ type: SET_PROFILE_ERRORS, payload: error.response.data.errors});
        }
    }
}