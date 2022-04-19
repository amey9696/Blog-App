import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import {updateImageAction} from '../store/asyncMethods/PostMethods';
import { RESET_UPDATE_IMAGE_ERRORS } from '../store/types/PostTypes';
import Loader from './Loader';

const EditImage = () => {
	const { push } = useHistory();
    const { id } = useParams();
    const dispatch=useDispatch();
    const {updateImageErrors}=useSelector((state)=>state.UpdateImage);
    const { loading, redirect } = useSelector((state) => state.PostReducer);
    const [state, setState] = useState({
        image: '',
        imagePreview:'',
        imageName: 'Choose Image',
    });
    const [imgPreview, setImgPreview] = useState('');

    const fileHandle = (e) => {
        if (e.target.files.length !== 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setState({
                    ...state,
                    image: e.target.files[0],
                    imageName: e.target.files[0].name,
                });
                setImgPreview(reader.result);
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    const updateImage=(e)=>{
        e.preventDefault();
        const formData=new FormData();
        formData.append('id',id);
        formData.append('image',state.image);
        dispatch(updateImageAction(formData));
    }

    useEffect(()=>{
        if (updateImageErrors.length !== 0) {
			updateImageErrors.map((error) => toast.error(error.msg));
			dispatch({ type: RESET_UPDATE_IMAGE_ERRORS });
		}
    },[updateImageErrors]);

    useEffect(()=>{
        if(redirect){
            push('/dashboard');
        }
    },[redirect]);

    return !loading ? (
        <div className='container mt-100'>
            <Helmet>
                <title>Edit Image Page</title>
                <meta name="edit" content="Edit Image page." />
            </Helmet>
            <Toaster position="top-right" reverseOrder={false} toastOptions={{ style: { fontSize: '14px' }, }} />
            <div className='row ml-minus-15 mr-minus-15'>
                <div className='col-6'>
                    <div className='card'>
                        <h3 className="card_h3">Update Image Page</h3>
                        <form onSubmit={updateImage}>
                            <div className="group">
                                <label htmlFor="image" className="image_label">{state.imageName}</label>
                                <input type="file" name="image" id="image" accept="image/*" onChange={fileHandle} />
                            </div>
                            <div className="group">
                                <div className="imagePreview">
                                    {
                                        imgPreview ? <img src={imgPreview} /> : ''
                                    }
                                </div>
                            </div>
                            <div className='group'>
                                <input type='submit' value='Update image' className='btn btn-default btn-block' />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div> ) : (
        <Loader/>
    );
};

export default EditImage;

