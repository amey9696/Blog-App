import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useParams, useHistory } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPost, updateAction } from "../store/asyncMethods/PostMethods";
import { POST_RESET, RESET_UPDATE, RESET_UPDATE_ERRORS } from '../store/types/PostTypes';
import toast, { Toaster } from 'react-hot-toast';
import Loader from './Loader';

const Edit = () => {
	const { push } = useHistory();
    const { id } = useParams();
    const [value, setValue] = useState('');
    const [editData, setEditData] = useState('');
    const [state, setState] = useState({
        title: '',
        description: '',
    });
    const dispatch = useDispatch(); //dispatch used for perform action
    const { loading, redirect } = useSelector((state) => state.PostReducer);
    const { post, postStatus } = useSelector((state) => state.FetchPost); //import from main redux file i.e index.js redux file
    const { editErrors } = useSelector((state) => state.UpdatePost);

    useEffect(() => {
        if (postStatus) {
            setState({
                title: post.title,
                description: post.description,
            });
            setEditData(post.body);
            dispatch({ type: POST_RESET });
        } else {
            dispatch(fetchPost(id));
        }
    }, [post]);

    const inputHandler = (event, editor) => {
        setValue(editor.getData());
    };

    const updatePost = (e) => {
        e.preventDefault();
        dispatch(updateAction({
            title: state.title,
            body: value,
            // body:editData,
            description: state.description,
            id: post._id,
        }));
    }
    
	useEffect(() => {
		if (editErrors.length !== 0) {
			editErrors.map((error) => toast.error(error.msg));
			dispatch({ type: RESET_UPDATE_ERRORS });
		}
	}, [editErrors]); //if editErrors is updated then this useEffect is run

    useEffect(()=>{
        if(redirect){
            push('/dashboard');
        }
    },[redirect]);

    return !loading ? (
    <div className='mt-100'>
            <Helmet>
                <title>Edit Post Page</title>
                <meta name="edit" content="Edit Post page." />
            </Helmet>
            <Toaster position="top-right" reverseOrder={false} toastOptions={{ style: { fontSize: '14px' }, }} />
            <div className="container">
                <div className="row ml-minus-15 mr-minus-15">
                    <div className="col-6">
                        <div className="card">
                            <h3 className="card_h3">Edit post</h3>
                            <form onSubmit={updatePost}>
                                <div className="group">
                                    <label htmlFor="title">Post Title</label>
                                    <input type="text" name="title" id="title" className="group_control"
                                        value={state.title} onChange={(e) => setState({ ...state, title: e.target.value })} placeholder="Post Title" />
                                </div>
                                <div className="group">
                                    <label htmlFor="body">Post body</label>
                                    <CKEditor
                                        // id="inputText"
                                        id="body"
                                        editor={ClassicEditor}
                                        value={value}
                                        data={editData}
                                        onChange={inputHandler}
                                        config={{ placeholder: " Write Post body here..." }}
                                    />
                                </div>
                                <div className="group">
                                    <label htmlFor="description">Meta Description</label>
                                    <textarea name="description" id="description" cos="30" rows="10" maxLength='150'
                                        defaultValue={state.description} onChange={(e) => setState({ ...state, description: e.target.value })}
                                        onKeyUp={(e) => setState({ ...state, description: e.target.value })}
                                        className="group_control" placeholder="Meta Description..." ></textarea>
                                    <p className="length">{state.description ? state.description.length : 0}</p>
                                </div>
                                <div className="group">
                                    <input type="submit" className="btn btn-default btn-block"
                                        value='Edit Post' />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div> ) : (
        <Loader/>
    );
};
export default Edit;