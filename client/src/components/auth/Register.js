import {useState,useEffect} from 'react';
import BgImage from "./BgImage";
import {Helmet} from "react-helmet";
import {useDispatch, useSelector} from 'react-redux';
import {postRegister} from '../../store/asyncMethods/AuthMethods';
import toast,{Toaster} from 'react-hot-toast';

const Register = (props) => {
  const [state,setState]=useState({
    name:'',
    email:'',
    password:'',
  });
  const {loading, registerError, user}=useSelector((state)=>state.AuthReducer);
  const dispatch = useDispatch();
  const handleInputs=(e)=>{
    setState({
      ...state,
      [e.target.name]:e.target.value
    })
  }

  const userRegister=async(e)=>{
    e.preventDefault();
    // console.log(state);
    dispatch(postRegister(state));
  }
  
  useEffect(()=>{
    if(registerError.length>0){
      registerError.map((error)=>toast.error(error.msg))
    }
  },[registerError,user])

  return (
    <>
      <Helmet>
        <title>Register Page</title>
        <meta name="description" content="Register page."/>
      </Helmet>
      <div className="row mt-80">
        <div className="row col-8">
          <BgImage />
          <Toaster position="top-right" reverseOrder={false} toastOptions={{style:{fontSize:'14px'}}}/>
        </div>
        <div className="row col-4 ">
          <div className="account">
            <div className="account_section">
              <form onSubmit={userRegister}>
                <div className="group">
                  <h3 className="form-hading">Register</h3>
                </div>
                <div className="group">
                  <input type="text" name="name" className="group_control" 
                    value={state.name} onChange={handleInputs} placeholder="Enter Name"/>
                </div>
                <div className="group">
                  <input type="email" name="email" className="group_control" 
                    value={state.email} onChange={handleInputs} placeholder="Enter Email"/>
                </div>
                <div className="group">
                  <input type="password" name="password" className="group_control" 
                    value={state.password} onChange={handleInputs} placeholder="Enter password"/>
                </div>
                <div className="group">
                  <input type="submit" className="btn btn-default btn-block" 
                    value={loading ? '...':'Register'}/>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register;