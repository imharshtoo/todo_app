import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


const Signup = (props) => {
    let history=useNavigate();
    const [credentials,setCredentials]=useState({name:"",email:"",password:"",cpassword:""});
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const {name,email,password}=credentials;
        const response=await fetch(`http://localhost:5000/api/auth/createuser`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'auth-token':"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVkMzQ5YzliZTA2OTk4M2ZlN2FmN2U4In0sImlhdCI6MTcwODM0OTE0NH0.y2SiMWjPh6-flp96mV-7MQIOIO3RPU5QTsuwE129WVA"
            },
            body:JSON.stringify({name,email,password})
        });
        const json=await response.json();
        console.log(json);
        if(json.success){
            //redirect
            localStorage.setItem("token",json.authtoken);
            history("/")
            props.showAlert("Account Created Successfully","success")
        }
        else{
            props.showAlert("Invalid credentials","danger")
        }
    }
    const onChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value});
    }
    return (
        <div className='container mt-3'>
            <h2 className='my-3'>Create an account to use iNotebook</h2>
            <form className='container' onSubmit={handleSubmit}>
            <div className="my-3" >
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" onChange={onChange} className="form-control" id="name" aria-describedby="emailHelp" name='name'/>
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp"/>
                <div id="emailHelp"  className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" onChange={onChange} className="form-control" id="password" name='password' required minLength={5}/>
            </div>
            <div className="mb-3">
                <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                <input type="password" onChange={onChange}className="form-control" id="cpassword" name='cpassword' required minLength={5}/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup
