import {useState, useEffect} from 'react';
import BgImage from "./BgImage";
import { Helmet } from "react-helmet";
import {postLogin} from '../../store/asyncMethods/AuthMethods';
import {useDispatch, useSelector} from 'react-redux';
import toast,{Toaster} from 'react-hot-toast';
import {Link} from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const {loginError, loading}=useSelector((state)=>state.AuthReducer);

    const [state,setState] = useState({
        email:'',
        password:'',
    })

    const handleInputs=(e)=>{
        setState({
            ...state,
            [e.target.name]:e.target.value,
        })
    }
    const userLogin=(e)=>{
        e.preventDefault();
        // console.log(state);
        dispatch(postLogin(state));
    }
    useEffect(()=>{
        if(loginError.length>0){
            loginError.map((error)=>toast.error(error.msg))
        }
      },[loginError])
    
    return (
        <>
            <Helmet>
               <title>Login Page</title>
               <meta name="description" content="Login page."/>
           </Helmet> 
            <div className="row mt-80">
                <div className="row col-8">
                    <BgImage />
                    <Toaster position="top-right" reverseOrder={false} toastOptions={{style:{fontSize:'14px'},}}/>
                </div>
                <div className="row col-4 ">
                    <div className="account">
                        <div className="account_section">
                            <form onSubmit={userLogin}>
                                <div className="group">
                                    <h3 className="form-hading">Login</h3>
                                </div>
                                <div className="group">
                                    <input type="email" name="email" className="group_control" 
                                        value={state.email} onChange={handleInputs} placeholder="Enter Email" />
                                </div>
                                <div className="group">
                                    <input type="password" name="password" className="group_control" 
                                        value={state.password} onChange={handleInputs} placeholder="Enter password" />
                                </div>
                                <div className="group">
                                    <Link to={'/forgotPassword'}><span className='forgot_password'>Forgot Password?</span></Link>
                                </div>
                                <div className="group">
                                <input type="submit" className="btn btn-default btn-block" 
                                    value={loading ? '...':'Login'}/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;