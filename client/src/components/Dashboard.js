import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from "react-helmet";
import { REDIRECT_FALSE, REMOVE_MESSAGE, SET_LOADER, CLOSE_LOADER, SET_MESSAGE } from '../store/types/PostTypes';
import toast, { Toaster } from 'react-hot-toast';
import { fetchPosts } from '../store/asyncMethods/PostMethods';
import { Link, useParams } from 'react-router-dom';
import { BsPencil, BsTrash, BsImage } from "react-icons/bs";
import Loader from './Loader';
import Sidebar from './Sidebar';
import Pagination from './Pagination';
import axios from 'axios';
import moment from 'moment';

const Dashboard = () => {
    const { redirect, message, loading } = useSelector(state => state.PostReducer);
    const { user: { _id }, token } = useSelector(state => state.AuthReducer); //{user :{_id}} for fetch id from structure like {_id:123, name:bnm} etc
    // console.log(_id);
    const { posts, count, perPage } = useSelector(state => state.FetchPosts);
    // console.log("my posts:", posts);
    let { page } = useParams();
    if (page === undefined) {
        page = 1;
    }
    const dispatch = useDispatch();

    const deletePost = async (id) => {
        const confirm = window.confirm("Are you really want to delete this post?")
        if (confirm) {
            dispatch({ type: SET_LOADER });
            try {
                const config = {
                    headers: {
                        Authorization: `${token}`,
                    },
                };
                const { data: { msg } } = await axios.get(`http://localhost:8000/delete/${id}`, config);
                // const {data:{msg}} = await axios.get(`https://heroku-blog-server-app.herokuapp.com/delete/${id}`, config );
                dispatch(fetchPosts(_id, page)); //id send to PostMethods fetchPosts function
                dispatch({ type: SET_MESSAGE, payload: msg });
            } catch (error) {
                dispatch({ type: CLOSE_LOADER });
                console.log(error);
            }
        }
    }

    useEffect(() => {
        if (redirect) {
            dispatch({ type: REDIRECT_FALSE });
        }
        if (message) {
            toast.success(message);
            dispatch({ type: REMOVE_MESSAGE });
        }
    }, [message]);

    useEffect(() => {
        dispatch(fetchPosts(_id, page)); //id send to PostMethods fetchPosts function
    }, [page])
    return (
        <>
            <Helmet>
                <title>Dashboard Page</title>
                <meta name="description" content="Dashboard page." />
            </Helmet>
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ style: { fontSize: '14px' }, }} />
            <div className='container mt-100'>
                <div className='row ml-minus-15 mr-minus-15'>
                    <div className='col-3 p-15'>
                        {/* In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available */}
                        <Sidebar />
                    </div>
                    <div className='col-9 p-15'>
                        {!loading ? posts.length > 0 ? posts.map(post => (
                            <div className='dashboard_posts' key={post._id}>
                                <div className='dashboard_posts_title'>
                                    <Link to={`/details/${post.slug}`}>{post.title}</Link>
                                    <span>published {moment(post.updatedAt).fromNow()}</span>
                                </div>
                                <div className='dashboard_posts_links'>
                                    <Link to={`/updateImage/${post._id}`}>
                                        <BsImage className='icon' />
                                    </Link>
                                    <Link to={`/edit/${post._id}`}>
                                        <BsPencil className='icon' />
                                    </Link>
                                    <BsTrash className='icon' onClick={() => deletePost(post._id)} />
                                </div>
                            </div>
                        )) : `you don't have any posts` : (<Loader />)}
                        <Pagination path="dashboard" page={page} perPage={perPage} count={count} /> {/* passing props to Pagination component  */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;