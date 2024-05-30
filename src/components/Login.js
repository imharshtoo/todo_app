import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    let history=useNavigate();
    const [credentials,setCredentials]=useState({email:"",password:""});
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const response=await fetch(`http://localhost:5000/api/auth/login`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'auth-token':"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVkMzQ5YzliZTA2OTk4M2ZlN2FmN2U4In0sImlhdCI6MTcwODM0OTE0NH0.y2SiMWjPh6-flp96mV-7MQIOIO3RPU5QTsuwE129WVA"
            },
            body:JSON.stringify({email:credentials.email,password:credentials.password})
        });
        const json=await response.json();
        console.log(json);
        if(json.success){
            //redirect
            localStorage.setItem("token",json.authtoken);
            props.showAlert("Account logged In Successfully","success")
            history("/")
        }
        else{
            props.showAlert("invalid details","danger")
        }
    }
    const onChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value});
    }
    return (
        <div className='container mt-3'>
            <h2>Login to continue to iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' onChange={onChange} value={credentials.email} aria-describedby="emailHelp"/>
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" onChange={onChange} value={credentials.password} className="form-control" id="password" name='password'/>
                </div>
                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </div>
    )
}

export default Login
