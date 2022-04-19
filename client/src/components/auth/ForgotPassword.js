import React, {useState, useEffect} from 'react';
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from 'react-redux';
import {emailSend} from '../../store/asyncMethods/AuthMethods';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../Loader';
import { useHistory } from 'react-router-dom';
import { RESET_FORGOT_PASSWORD_ERRORS } from '../../store/types/Usertypes';

const ForgotPassword = () => {
    const { loading, redirect } = useSelector((state) => state.PostReducer);
    const { forgotPassErrors }=useSelector((state)=>state.AuthReducer);
    const dispatch = useDispatch();
    const { push } = useHistory();

    const [state,setState] = useState({
        email:''
    });

    const handleInputs=(e)=>{
        setState({
            ...state,
            [e.target.name]:e.target.value,
        })
    }
    const nextPage=(e)=>{
        e.preventDefault();
        dispatch(emailSend(state));
    }

    useEffect(()=>{
        if(forgotPassErrors.length>0){
            forgotPassErrors.map((error)=>toast.error(error.msg));
			dispatch({ type: RESET_FORGOT_PASSWORD_ERRORS });
        }
    },[forgotPassErrors])

    useEffect(()=>{
        if(redirect){
            push('/enterOtp');
        }
    },[ redirect ])
    
    return !loading ? (
        <div className='container mt-100'>
            <Helmet>
                <title>Forgot password Page</title>
                <meta name="edit" content="Forgot password page." />
            </Helmet>
            <Toaster position="top-right" reverseOrder={false} toastOptions={{ style: { fontSize: '14px' }, }} />
            <div className='row ml-minus-15 mr-minus-15'>
                <div className='col-3 p-15'></div>
                <div className='col-6 p-15'>
                    <div className='card'>
                        <h3 className='card_h3'>Forgot Password</h3>
                        <form onSubmit={nextPage}>
                            <div className='group'>
                                <input type="email" name="email" className="group_control" placeholder='Enter Email'
                                    onChange={handleInputs} value={state.email} />
                            </div>
                            <div className="group">
                                <input type="submit" className="btn btn-default btn-block" value='Send OTP'/>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='col-3 p-15'></div>
            </div>
        </div> 
    ) : (
        <Loader/>
    );
}

export default ForgotPassword