import axios from 'axios';
import {
    CREATE_ERRORS,
    REMOVE_ERRORS,
    SET_LOADER,
    CLOSE_LOADER,
    REDIRECT_TRUE,
    REDIRECT_FALSE,
    SET_MESSAGE,
    REMOVE_MESSAGE,
    SET_POSTS,
    SET_POST,
    POST_REQUEST,
    POST_RESET,
    SET_UPDATE_ERRORS,
    RESET_UPDATE_ERRORS,
    UPDATE_IMAGE_ERRORS,
    RESET_UPDATE_IMAGE_ERRORS,
    SET_DETAILS,
    COMMENTS
} from "../types/PostTypes";

export const createAction = (postData) => {
    return async (dispatch, getState) => {
        const { AuthReducer: { token } } = getState();
        dispatch({ type: SET_LOADER });
        try {
            const config = {
                headers: {
                    // Authorization:`Bearer ${token}` 
                    Authorization: `${token}`
                }
            }
            const { data: { msg } } = await axios.post('http://localhost:8000/create_post', postData, config);
            // const {data :{msg}} =await axios.post('https://heroku-blog-server-app.herokuapp.com/create_post',postData, config); 
            dispatch({ type: CLOSE_LOADER });
            dispatch({ type: REMOVE_ERRORS });
            dispatch({ type: REDIRECT_TRUE });
            // console.log(data);
            dispatch({ type: SET_MESSAGE, payload: msg });
        } catch (error) {
            console.log(error.response);
            const { errors } = error.response.data;
            dispatch({ type: CLOSE_LOADER });
            dispatch({ type: CREATE_ERRORS, payload: errors });
        }
    }
}

export const fetchPosts = (id, page) => {
    return async (dispatch, getState) => {
        const { AuthReducer: { token } } = getState();
        dispatch({ type: SET_LOADER });
        try {
            const config = {
                headers: {
                    // Authorization:`Bearer ${token}` 
                    Authorization: `${token}`
                },
            };
            const { data: { response, count, perPage }, } = await axios.get(`http://localhost:8000/posts/${id}/${page}`, config);
            // const {data:{response, count, perPage},}=await axios.get(`https://heroku-blog-server-app.herokuapp.com/posts/${id}/${page}`,config);
            dispatch({ type: CLOSE_LOADER });
            // console.log(response);
            dispatch({ type: SET_POSTS, payload: { response, count, perPage } });
        } catch (error) {
            dispatch({ type: CLOSE_LOADER });
        }
    }
}

export const fetchPost = (id) => {
    return async (dispatch, getState) => {
        const { AuthReducer: { token } } = getState();
        const config = {
            headers: {
                // Authorization:`Bearer ${token}` 
                Authorization: `${token}`
            },
        };
        dispatch({ type: SET_LOADER });
        try {
            const { data: { post } } = await axios.get(`http://localhost:8000/post/${id}`, config);
            // const {data:{post}}=await axios.get(`https://heroku-blog-server-app.herokuapp.com/post/${id}`,config)
            dispatch({ type: CLOSE_LOADER });
            dispatch({ type: SET_POST, payload: post });
            dispatch({ type: POST_REQUEST });
        } catch (error) {
            dispatch({ type: CLOSE_LOADER });
            console.log(error.message);
        }
    }
}

export const updateAction = (editData) => {
    return async (dispatch, getState) => {
        const {
            AuthReducer: { token },
        } = getState();
        const config = {
            headers: {
                Authorization: `${token}`,
            },
        };
        dispatch({ type: SET_LOADER });
        try {
            const { data } = await axios.post('http://localhost:8000/update', editData, config);
            // const { data } = await axios.post('https://heroku-blog-server-app.herokuapp.com/update', editData, config);
            dispatch({ type: CLOSE_LOADER });
            dispatch({ type: REDIRECT_TRUE });
            dispatch({ type: SET_MESSAGE, payload: data.msg });
        } catch (error) {
            const {
                response: {
                    data: { errors },
                },
            } = error;
            dispatch({ type: CLOSE_LOADER });
            dispatch({ type: SET_UPDATE_ERRORS, payload: errors });
            console.log(error.response);
        }
    };
};

export const updateImageAction = (updateData) => {
    return async (dispatch, getState) => {
        const {
            AuthReducer: { token },
        } = getState();
        const config = {
            headers: {
                Authorization: `${token}`,
            },
        };
        dispatch({ type: SET_LOADER });
        try {
            const { data: { msg } } = await axios.post('http://localhost:8000/updateImage', updateData, config);
            // const { data:{msg} } = await axios.post('https://heroku-blog-server-app.herokuapp.com/updateImage', updateData, config);
            dispatch({ type: CLOSE_LOADER });
            dispatch({ type: REDIRECT_TRUE });
            dispatch({ type: SET_MESSAGE, payload: msg });
        } catch (error) {
            const { response: { data: { errors } } } = error;
            dispatch({ type: CLOSE_LOADER });
            dispatch({ type: UPDATE_IMAGE_ERRORS, payload: errors });
        }
    }
}

export const homePosts = (page) => {
	return async (dispatch) => {
		dispatch({ type: SET_LOADER });
		try {
			const { data: { response, count, perPage } } = await axios.get(`http://localhost:8000/home/${page}`);
			// const { data: { response, count, perPage } } = await axios.get(`https://heroku-blog-server-app.herokuapp.com/home/${page}`);
			dispatch({ type: CLOSE_LOADER });
			dispatch({ type: SET_POSTS, payload: { response, count, perPage } });
		} catch (error) {
			dispatch({ type: CLOSE_LOADER });
			console.log(error);
		}
	};
};

export const postDetails = (id) => {
	return async (dispatch) => {
		dispatch({ type: SET_LOADER });
        try {
            const { data: { post, comments } } = await axios.get(`http://localhost:8000/details/${id}`);
			// const { data: { post } } = await axios.get(`https://heroku-blog-server-app.herokuapp.com/details/${id}`);
			dispatch({ type: CLOSE_LOADER });
			dispatch({ type: SET_DETAILS, payload:post });
			dispatch({ type: COMMENTS, payload:comments });
        } catch (error) {
            dispatch({ type: CLOSE_LOADER });
			console.log(error);
        }
    }
}

export const postComment = (commentData) => {
    return async (dispatch, getState) => {
        const {
            AuthReducer: { token },
        } = getState();
        const config = {
            headers: {
                Authorization: `${token}`,
            },
        };
		dispatch({ type: SET_LOADER });
        try {
            const { data } = await axios.post(`http://localhost:8000/comment`, commentData, config );
			// const { data: { post } } = await axios.post(`https://heroku-blog-server-app.herokuapp.com/comment`, commentData, config );
			dispatch({ type: CLOSE_LOADER });
            dispatch({ type: SET_MESSAGE, payload: data.msg });
            console.log(data)
		 } catch (error) {
            dispatch({ type: CLOSE_LOADER });
			console.log(error);
        }
    }
}