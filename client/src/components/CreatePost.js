import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { createAction } from "../store/asyncMethods/PostMethods";
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import Loader from './Loader';

const CreatePost = (props) => {
    const { createErrors, redirect, loading } = useSelector((state) => state.PostReducer);
    const [currentImg, setcurrentImg] = useState('Choose Image');
    const [imgPreview, setImgPreview] = useState('');
    const [url, setURL] = useState('');

    const dispatch = useDispatch();
    // const {_id, name}=user;
    const { user: { _id, name } } = useSelector((state) => state.AuthReducer);
    // console.log(_id, name);

    const fileHandle = (e) => {
        if (e.target.files.length !== 0) { //solve error when u 2nd time choose image
            // console.log(e.target.files[0].name );
            setcurrentImg(e.target.files[0].name);

            //all data send to backend
            setState({
                ...state,
                [e.target.name]: e.target.files[0],
            })
            //image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgPreview(reader.result);
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    const [state, setState] = useState({
        title: '',
        description: '',
        image: '',
    });

    const handleDescription = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        })
    }

    const [slug, setSlug] = useState('');
    const [slugButton, setSlugButton] = useState(false);

    //url like this=>html-crash-course
    const slugHandle = (e) => {
        setSlugButton(true);
        setSlug(e.target.value);
    }

    const handleURL = (e) => {
        e.preventDefault();
        setSlug(slug.trim().split(' ').join('-'));
    }

    const handleInput = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
        const createSlug = e.target.value.trim().split(' ').join('-').replace(/[?:;"',.<>`!@#$%^&*()_=+/|]+/g, '');
        setSlug(createSlug);
    }

    const [value, setValue] = useState('');

    const inputHandler = (event, editor) => {
        // console.log(editor.getData());
        setValue(editor.getData());
    };

    // ****************************************************************  UPLOAD WARNIGN FILTER *************************************************************************************************
    let illegal = ['porn', 'harrasment', 'suicide', 'murder']; //add some word here...
    let titleError = [];
    const title = slug.split('-');
    title.forEach(element => {
        if (illegal.includes(element)) {
            titleError.push(element);
            console.log(element)
        }
    });

    const createBlogPost = (e) => {
        e.preventDefault();
        if (titleError.length !== 0) {
            toast.error("According to our policy, Your title contain illegal word. Please change the title");
            // console.log("Please change the title");
        } else {
            // console.log("ok");
            // toast.error("ALL OK");
            const { title, description, image } = state;
            const formData = new FormData();
            formData.append('title', title);
            formData.append('body', value);
            formData.append('image', image);
            // formData.append("file", image);
            // formData.append("upload_preset", "insta-clone"); //name of cloudinary project
            // formData.append("cloud_name", "thunderbolt");
            formData.append('description', description);
            formData.append('slug', slug);
            formData.append('name', name); //username
            formData.append('id', _id);

            // fetch('https://api.cloudinary.com/v1_1/thunderbolt/image/upload', {
            //     method: 'post',
            //     body: formData,
            // }).then(res => res.json())
            //     .then(data => {
            //         // console.log(data);
            //         setURL(data.url);
            //     }).catch(err => {
            //         console.log(err);
            //     });
            // formData.append('image', url);

            dispatch(createAction(formData));
        }
    }

    // *****************************************************************************************************************************************************************************
    useEffect(() => {
        if (redirect) {
            props.history.push('/dashboard');
        }
        if (createErrors.length !== 0) {
            createErrors.map(err => toast.error(err.msg));
        }
    }, [createErrors, redirect]) //if createError is updated then run useEffect hook
    return (
        <>
            <div className="create mt-100">
                <Helmet>
                    <title>Create Post Page</title>
                    <meta name="description" content="Create New Post page." />
                </Helmet>
                <Toaster position="top-right" reverseOrder={false} toastOptions={{ style: { fontSize: '14px' }, }} />

                {
                    !loading ?
                        <div className="container">
                            <form onSubmit={createBlogPost}>
                                <div className="row ml-minus-15 mr-minus-15">
                                    <div className="col-6 p-15">
                                        <div className="card">
                                            <h3 className="card_h3">Create a new post</h3>
                                            <div className="group">
                                                <label htmlFor="title">Post Title</label>
                                                <input type="text" name="title" id="title"
                                                    value={state.title} onChange={handleInput} className="group_control" placeholder="Enter Title" />
                                            </div>
                                            <div className="group">
                                                <label htmlFor="image" className="image_label">{currentImg}</label>
                                                <input type="file" name="image" id="image" accept="image/*" onChange={fileHandle} />
                                            </div>
                                            <div className="group">
                                                <label htmlFor="body">Post body</label>
                                                <CKEditor
                                                    // id="inputText"
                                                    id="body"
                                                    editor={ClassicEditor}
                                                    value={value}
                                                    onChange={inputHandler}
                                                    config={{ placeholder: " Write Post body here..." }}
                                                />
                                            </div>
                                            <div className="group">
                                                <label htmlFor="description">Meta Description</label>
                                                <textarea name="description" id="description" cos="30" rows="10" maxLength='150'
                                                    className="group_control" placeholder="Meta Description..."
                                                    defaultValue={state.description} onChange={handleDescription} ></textarea>
                                                <p className="length">{state.description ? state.description.length : 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 p-15">
                                        <div className="card">
                                            <div className="group">
                                                <label htmlFor="slug">Post URL</label>
                                                <input type="text" className="group_control" name="slug"
                                                    value={slug} onChange={slugHandle} id="slug" placeholder="Post URL..." />
                                            </div>
                                            <div className="group">
                                                {
                                                    slugButton ? (<button className="btn btn-default" onClick={handleURL}>Update Slug</button>)
                                                        : ('')
                                                }
                                            </div>
                                            <div className="group">
                                                <div className="imagePreview">
                                                    {
                                                        imgPreview ? <img src={imgPreview} /> : ''
                                                    }
                                                </div>
                                            </div>
                                            <div className="group">
                                                <input type="submit" className="btn btn-default btn-block"
                                                    value='Create Post' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        : <Loader />
                }
            </div>
        </>
    )
}
export default CreatePost;