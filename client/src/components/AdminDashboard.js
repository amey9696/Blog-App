import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from 'react-redux';
import { homePosts } from '../store/asyncMethods/PostMethods';
import { useParams, Link } from 'react-router-dom';
import Loader from './Loader';
import moment from 'moment';
import Pagination from './Pagination';
import { htmlToText } from 'html-to-text';
import Avatar from 'react-avatar';
import { BsTrash } from "react-icons/bs";

import { SET_LOADER, CLOSE_LOADER, SET_MESSAGE } from '../store/types/PostTypes';
import { fetchPosts } from '../store/asyncMethods/PostMethods';
import axios from 'axios';

const AdminDashboard = () => {
    let { page } = useParams();
    if (page === undefined) {
        page = 1;
    }

    const { user: { _id } } = useSelector(state => state.AuthReducer); //{user :{_id}} for fetch id from structure like {_id:123, name:bnm} etc

    const { loading } = useSelector((state) => state.PostReducer);
    const { posts, count, perPage } = useSelector((state) => state.FetchPosts);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(homePosts(page));
    }, [page]);

    const deletePost = async (id) => {
        const confirm = window.confirm("Are you really want to delete this post?")
        if (confirm) {
            dispatch({ type: SET_LOADER });
            try {
                // const config = {
                //     headers: {
                //         Authorization: `${token}`,
                //     },
                // };
                const { data: { msg } } = await axios.get(`http://localhost:8000/delete/${id}`);
                // const {data:{msg}} = await axios.get(`https://heroku-blog-server-app.herokuapp.com/delete/${id}`, config );
                dispatch(fetchPosts(_id, page)); //id send to PostMethods fetchPosts function
                dispatch({ type: SET_MESSAGE, payload: msg });
            } catch (error) {
                dispatch({ type: CLOSE_LOADER });
                console.log(error);
            }
        }
    }

    return (
        <>
            <Helmet>
                <title>Web Articles</title>
                <meta name="description" content="Learn html, css, javascript, react etc." />
            </Helmet>
            <div className="container">
                <div className='row mt-100' style={{ marginBottom: '30px' }}>
                    <div className='col-9 home'>
                        {
                            !loading ? (
                                posts.length > 0 ? (
                                    posts.map(post => (
                                        <div className='row post-style' key={post._id}>
                                            <div className='col-8'>
                                                <div className='post'>
                                                    <div className='post_header'>
                                                        <div className='post_header_avator'>
                                                            <Avatar className="mr-2" name={post.userName} size='50' round={true} style={{ border: 'none' }} />
                                                        </div>
                                                        <div className='post_header_user'>
                                                            <span>{post.userName}</span>
                                                            <span>{moment(post.updatedAt).format('MMM Do YY')}</span>
                                                        </div>
                                                    </div>
                                                    <div className='post_body'>
                                                        <h2 className='post_body_title'>
                                                            <Link to={`/details/${post.slug}`}>{post.title}</Link>
                                                        </h2>
                                                        <div className='post_body_details'>{htmlToText(post.body.slice(0, 300))}</div>
                                                        <BsTrash style={{ fontSize: '20px', color: 'red', cursor: 'pointer' }} onClick={() => deletePost(post._id)} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-4'>
                                                <div className='post_image'>
                                                    <img src={`/image/${post.image}`} alt={post.image} />
                                                </div>
                                            </div>
                                        </div>)
                                    )
                                ) : 'No Posts'
                            ) : <Loader />
                        }
                    </div>
                </div>
                <div className='row'>
                    <div className='col-9'>
                        <Pagination path="home" page={page} perPage={perPage} count={count} />
                    </div>
                </div>
            </div>
        </>
    )
}
export default AdminDashboard;