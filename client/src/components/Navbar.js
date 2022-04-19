import React from 'react';
import {Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {LOGOUT} from '../store/types/Usertypes';

const Navbar = () => {
    const {user}=useSelector((state)=>state.AuthReducer);
    const dispatch = useDispatch();
    const logout=()=>{
        localStorage.removeItem('myToken');
        dispatch({type: LOGOUT});
    }
    const Links=user ? 
        <div className="navbar_right ">
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/create">Create Post</Link>
            </li>
            <li>
                <Link to="/dashboard/1">{user.name}</Link>
            </li>
            <li>
                <span onClick={logout} style={{cursor:'pointer'}}>Logout</span>
            </li>
        </div> 
    :    
        <div className="navbar_right ">
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/login">Login</Link>
            </li>
            <li>
                <Link to="/register">Register</Link>
            </li>
        </div>
    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar_row">
                    <div className="navbar_left ">
                        <img src="/image/logo.png" alt="logo "/> 
                    </div>
                        <h1 style={{marginLeft:-650}}>HR TECH</h1>
                        {/* <h1 style={{marginLeft:-650}}>Child Tube</h1> */}
                    {Links}
                </div>
            </div>
        </nav> 
    )
}

export default Navbar;