import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { postDetails, postComment } from '../store/asyncMethods/PostMethods';
import Loader from './Loader';
import moment from 'moment';
import { htmlToText } from 'html-to-text';
import Comments from './Comments';
import Avatar from 'react-avatar';
import { RiThumbUpFill, RiThumbDownFill } from "react-icons/ri";

const Details = () => {
    const { id } = useParams();
    const [comment, setComment] = useState('');
    const { loading, details, comments } = useSelector((state) => state.PostReducer);
    const { user } = useSelector((state) => state.AuthReducer);
    const dispatch = useDispatch();
    const [data, setData] = useState('');
    // console.log(details);
    const addComment = (e) => {
        e.preventDefault();
        dispatch(postComment({ id: details._id, comment, userName: user.name }));
        setComment('');
        dispatch(postDetails(id));
    }

    useEffect(() => {
        dispatch(postDetails(id));
    }, [id]);

    const likePost = (id) => {
        fetch("http://localhost:8000/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("myToken")
            },
            body: JSON.stringify({
                postId: id,
            }),
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                // const newData = data.map(item => {
                //     if (item._id === result._id) {
                //         return result;
                //     } else {
                //         return item;
                //     }
                // })
                // setData(newData);
            }).catch(err => {
                console.log(err);
            })
    }

    const unlikePost = (id) => {
        fetch("http://localhost:8000/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("myToken")
            },
            body: JSON.stringify({
                postId: id,
            }),
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                // const newData = data.map(item => {
                //     if (item._id === result._id) {
                //         return result;
                //     } else {
                //         return item;
                //     }
                // })
                // setData(newData);
            }).catch(err => {
                console.log(err);
            })
    }

    return (
        <div className='container'>
            <div className='row mt-100'>
                <div className='col-8'>
                    {
                        !loading ? (
                            <div className='post_details'>
                                <Helmet>
                                    <title>{details.title}</title>
                                </Helmet>
                                <div className='post_header'>
                                    <div className='post_header_avator'>
                                        {/* {details.userName ? details.userName[0] : ''} */}
                                        {details.userName ? <Avatar className="mr-2" name={details.userName} size='50' round={true} style={{ border: 'none' }} /> : ''}
                                    </div>
                                    <div className='post_header_user'>
                                        <span>{details.userName}</span>
                                        <span>{moment(details.updatedAt).format('MMM Do YY')}</span>
                                    </div>
                                </div>
                                <div className='post_body'>
                                    <h1 className='post_body_title'>{details.title}</h1>
                                    <div className='post_body_details'>
                                        {htmlToText(details.body)}
                                    </div>
                                    <div className='post_body_image'>
                                        <img src={`/image/${details.image}`} alt={details.image} />
                                    </div>
                                </div>
                                {
                                    user ? (
                                        <>
                                            <div className='post_comment'>
                                                <form onSubmit={addComment}>
                                                    <div className="group">
                                                        <input type="text" className='group_control' placeholder='write a comment'
                                                            value={comment} onChange={(e) => setComment(e.target.value)} />
                                                    </div>
                                                    <div className="group">
                                                        <input type="submit" className="btn btn-default" value='Post Comment' />
                                                    </div>
                                                    {/* <div style={{ width: "20%", display: "flex", alignItem: 'center', jusifyContent: 'space-around', border: "2px solid black" }}> */}
                                                    <RiThumbUpFill style={{ fontSize: '25px' }} onClick={() => likePost()} />
                                                    <RiThumbDownFill style={{ fontSize: '25px' }} onClick={() => unlikePost()} />
                                                    <p style={{ fontSize: '15px', marginTop: '-5px' }}>Likes</p>
                                                    {/* </div> */}
                                                </form>
                                            </div>
                                            <h1>Comment Section</h1>
                                            <Comments comments={comments} />
                                        </>
                                    ) : (
                                        <>
                                            <h1>Comment Section</h1>
                                            <Comments comments={comments} />
                                        </>
                                    )
                                }
                            </div>
                        )
                            : <Loader />
                    }
                </div>
            </div>
        </div>
    )
}

export default Details;