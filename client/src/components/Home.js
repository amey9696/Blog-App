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
import axios from 'axios';

const Home = () => {
    let { page } = useParams();
    if (page === undefined) {
        page = 1;
    }

    const { loading } = useSelector((state) => state.PostReducer);
    const { posts, count, perPage } = useSelector((state) => state.FetchPosts);
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState('');

    useEffect(() => {
        dispatch(homePosts(page));
    }, [page]);

    const handleTextSearch = (e) => {
        setSearch(e.target.value);
        if (search !== "") {
            axios.get("http://localhost:8000/getAll").then(res => {
                let posts = res.data.post;
                if (posts) {
                    filterContent(posts, search)
                }
            })
        }
    }

    const filterContent = (posts, searchTerm) => {
        const result = posts.filter((post) => post.title.includes(searchTerm));
        setSearchResult(result);
        console.log(result);
    }

    const filter = searchResult ? searchResult : posts;

    return (
        <>
            <Helmet>
                <title>Web Articles</title>
                <meta name="description" content="Learn html, css, javascript, react etc." />
            </Helmet>
            <div className="container">
                <div className='row mt-100' style={{ marginBottom: '30px' }}>
                    <div className="box" style={{ width: '50%', display: 'flex', justifyContent: 'space-between' }}>
                        <h3 style={{ marginTop: '5px' }}>Search Here</h3>
                        <div className="inputData">
                            <input type="search" style={{ width: "500px", height: '30px', borderRadius: '10px', padding: "10px" }} placeholder="search post here...."
                                value={search} onChange={handleTextSearch}
                            />
                        </div>
                    </div>
                    <div className='col-9 home' style={{ marginTop: '20px' }}>
                        {
                            !loading ? (
                                filter.length > 0 ? (
                                    filter.map(post => (
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
export default Home;