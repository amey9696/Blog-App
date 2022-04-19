import React, {useState, useEffect} from 'react';
import Sidebar from './Sidebar';
import Helmet from "react-helmet";
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {updateNameAction} from '../store/asyncMethods/ProfileMethods';
import Loader from './Loader';
import {RESET_PROFILE_ERRORS} from '../store/types/ProfileType';

const UpdateName = () => {
    const { push } = useHistory();
    const [userName,setUserName]=useState('');
    const {user :{name,_id}}=useSelector(user=>user.AuthReducer);
    // console.log(name);
    const { loading, redirect } = useSelector((state) => state.PostReducer);
    const { updateErrors } = useSelector((state) => state.updateName);
    const dispatch=useDispatch();
    
    const updateNameMethod=(e)=>{
        e.preventDefault();
        dispatch(updateNameAction({
            name:userName,
            id:_id
        }));
    }

    useEffect(()=>{
        setUserName(name);
    },[]);

    useEffect(()=>{
        if (updateErrors.length !== 0) {
			updateErrors.map((error) => toast.error(error.msg));
			dispatch({ type: RESET_PROFILE_ERRORS });
		}
    },[updateErrors]);

    useEffect(()=>{
        if(redirect){
            push('/dashboard');
        }
    },[redirect]);

    return !loading ? (
        <div className='container mt-100'>
            <Helmet>
                <title>Update Name Page</title>
                <meta name="edit" content="Update Name page." />
            </Helmet>
            <Toaster position="top-right" reverseOrder={false} toastOptions={{ style: { fontSize: '14px' }, }} />
            <div className='row ml-minus-15 mr-minus-15'>
                <div className='col-3 p-15'>
                    <Sidebar/>
                </div>
                <div className='col-9 p-15'>
                    <div className='card'>
                        <h3 className='card_h3'>Update Name</h3>
                        <form onSubmit={updateNameMethod}>
                            <div className='group'>
                                <input type="text" name="" className="group_control" placeholder='Enter Name'
                                    onChange={(e)=>setUserName(e.target.value)} value={userName}/>
                            </div>
                            <div className="group">
                                <input type="submit" className="btn btn-default btn-block" value='Update Name'/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div> 
    ) : (
        <Loader/>
    );
};
export default UpdateName;


// Error=> Unhandled Rejection (Error): Actions may not have an undefined "type" property. Have you misspelled a constant?
//solution=> use export keyword in type when exporting some action Type in type folder