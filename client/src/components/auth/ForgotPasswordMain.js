import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from 'react-redux';
import { emailSend, changePassword } from '../../store/asyncMethods/AuthMethods';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../Loader';
import { useHistory } from 'react-router-dom';
import { RESET_FORGOT_PASSWORD_ERRORS, RESET_OTP_ERRORS } from '../../store/types/Usertypes';

const ForgotPasswordMain = () => {
    const { loading, redirect } = useSelector((state) => state.PostReducer);
    const { forgotPassErrors, otpErrors } = useSelector((state) => state.AuthReducer);
    const dispatch = useDispatch();
    const { push } = useHistory();

    const [state, setState] = useState({
        email: '',
        code: '',
        password: '',
    });

    const handleInputs = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        })
    }

    const gotoLogin = (e) => {
        e.preventDefault();
        setState({
            ...state,
            email: state.email,
            // otp:state.otp,
            code: state.code,
            password: state.password,
        });
        dispatch(emailSend(state));
        dispatch(changePassword(state));
    }

    useEffect(() => {
        if (forgotPassErrors.length > 0) {
            forgotPassErrors.map((error) => toast.error(error.msg));
            dispatch({ type: RESET_FORGOT_PASSWORD_ERRORS });
        }
        if (otpErrors.length > 0) {
            otpErrors.map((error) => toast.error(error.msg));
            dispatch({ type: RESET_OTP_ERRORS });
        }
    }, [forgotPassErrors, otpErrors])

    useEffect(() => {
        if (redirect) {
            push('/login');
        }
    }, [redirect])

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
                        <form onSubmit={gotoLogin}>
                            <div className='group'>
                                <input type="email" name="email" className="group_control" placeholder='Enter Email'
                                    onChange={handleInputs} value={state.email} />
                            </div>
                            <div className="group">
                                <input type="submit" className="btn btn-default btn-block" value='Send OTP' />
                            </div>
                        </form>
                        <h3 className='card_h3'>Change Password</h3>
                        {/* <form onSubmit={gotoLogin}> */}
                        <div className='group'>
                            <input type="number" name="code" className="group_control" placeholder='Enter OTP'
                                value={state.code}
                                onChange={handleInputs}
                            />
                        </div>
                        <div className='group'>
                            <input type="password" name="password" className="group_control" placeholder='Enter New Password'
                                value={state.password}
                                onChange={handleInputs}
                            />
                        </div>
                        <div className="group">
                            <input type="submit" className="btn btn-default btn-block" value='Change Password' />
                        </div>
                        {/* </form> */}
                    </div>
                </div>
                <div className='col-3 p-15'></div>
            </div>
        </div>
    ) : (
        <Loader />
    );
}

export default ForgotPasswordMain;