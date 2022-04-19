import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import toast, { Toaster } from 'react-hot-toast';
import { changePassword } from '../../store/asyncMethods/AuthMethods';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Loader from '../Loader';
import { RESET_OTP_ERRORS } from '../../store/types/Usertypes';
import { REDIRECT_FALSE, REMOVE_MESSAGE, SET_LOADER, CLOSE_LOADER, SET_MESSAGE } from '../../store/types/PostTypes';

const ForgotPasswordStepTwo = () => {
    const { push } = useHistory();
    const { loading, redirect, message } = useSelector((state) => state.PostReducer);
    const { otpErrors }=useSelector((state)=>state.AuthReducer);
    const dispatch = useDispatch();

    const [state,setState] = useState({
        code:'',
        password:'',
    })

    const handleInputs=(e)=>{
        setState({
            ...state,
            [e.target.name]:e.target.value,
        });
    }

    const gotoLogin=(e)=>{
        e.preventDefault();
        setState({
            ...state,
            // otp:state.otp,
            code:state.code,
            password:state.password,
        })
        dispatch(changePassword(state));
        
    }

    useEffect(()=>{
        if(otpErrors.length>0){
            otpErrors.map((error)=>toast.error(error.msg));
			dispatch({ type: RESET_OTP_ERRORS });
        }
    },[otpErrors])

    useEffect(()=>{
        if(redirect){
            if(!state.password==='' && !state.code===''){
                push('/login');
            }
        }
        if (message) {
            toast.success(message);
            dispatch({ type: REMOVE_MESSAGE });
            setState({
                code:'',
                password:'',
            })
        }
    },[ redirect,message ]);

    return !loading ? (
        <div className='container mt-100'>
            <Helmet>
                <title>Change password Page</title>
                <meta name="edit" content="Change password page." />
            </Helmet>
            <Toaster position="top-right" reverseOrder={false} toastOptions={{ style: { fontSize: '14px' }, }} />
            <div className='row ml-minus-15 mr-minus-15'>
                <div className='col-3 p-15'></div>
                <div className='col-6 p-15'>
                    <div className='card'>
                        <h3 className='card_h3'>Change Password</h3>
                        <form onSubmit={gotoLogin}>
                            <div className='group'>
                                <input type="number" name="code" className="group_control" placeholder='Enter OTP'
                                    onChange={handleInputs} 
                                    value={state.code} 
                                 />
                            </div>
                            <div className='group'>
                                <input type="password" name="password" className="group_control" placeholder='Enter New Password'
                                    onChange={handleInputs} 
                                    value={state.password} 
                                 />
                            </div>
                            <div className="group">
                                <input type="submit" className="btn btn-default btn-block" value='Change Password' />
                            </div>
                        </form>
                    </div>
                </div>
                <div className='col-3 p-15'></div>
            </div>
        </div>
    ) : (
        <Loader />
    );
};

export default ForgotPasswordStepTwo;