import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Helmet from "react-helmet";
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updatePasswordAction } from '../store/asyncMethods/ProfileMethods';
import Loader from './Loader';
import { RESET_PROFILE_ERRORS } from '../store/types/ProfileType';

const ChangePassword = () => {
    const { push } = useHistory();
    const [state, setState] = useState({
        currentPassword: '',
        newPassword: '',
        userId: null,
    });
    const { user: { _id } } = useSelector(user => user.AuthReducer);
    const { loading, redirect } = useSelector((state) => state.PostReducer);
    const { updateErrors } = useSelector((state) => state.updateName);
    const dispatch = useDispatch();

    const updatePasswordMethod = (e) => {
        e.preventDefault();
        dispatch(updatePasswordAction({
            currentPassword: state.currentPassword,
            newPassword: state.newPassword,
            userId: _id,
        }));
    }

    useEffect(() => {
        if (updateErrors.length !== 0) {
            updateErrors.map((error) => toast.error(error.msg));
            dispatch({ type: RESET_PROFILE_ERRORS });
        }
    }, [updateErrors]);

    useEffect(() => {
        if (redirect) {
            push('/dashboard');
        }
    }, [redirect]);

    return !loading ? (
        <div className='container mt-100'>
            <Helmet>
                <title>Update password Page</title>
                <meta name="edit" content="Update the user password." />
            </Helmet>
            <Toaster position="top-right" reverseOrder={false} toastOptions={{ style: { fontSize: '14px' }, }} />
            <div className='row ml-minus-15 mr-minus-15'>
                <div className='col-3 p-15'>
                    <Sidebar />
                </div>
                <div className='col-9 p-15'>
                    <div className='card'>
                        <h3 className='card_h3'>Change Password</h3>
                        <form onSubmit={updatePasswordMethod}>
                            <div className='group'>
                                <input type="password" name="" className="group_control" placeholder='Enter Current Password'
                                    onChange={(e) => setState({ ...state, currentPassword: e.target.value })} value={state.currentPassword} />
                            </div>
                            <div className='group'>
                                <input type="password" name="" className="group_control" placeholder='Enter New Password'
                                    onChange={(e) => setState({ ...state, newPassword: e.target.value })} value={state.newPassword} />
                            </div>
                            <div className="group">
                                <input type="submit" className="btn btn-default btn-block" value='Change Password' />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <Loader />
    );
};

export default ChangePassword;