const express=require("express");
const User = require("../models/User");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const router=express.Router();
const fetchuser=require("../middleware/fetchuser");
const {body, validationResult} =require("express-validator");
const JWT_SECRET='harshisgood$boy';

//create a user using:POST "/api/auth". Doesn't require auth
router.post("/createuser",[
    body("email","enter a valid email").isEmail(),
    body("name","enter a valid name").isLength({min:3}),
    body("password","password must be atleast 5 characters").isLength({min:5}),
],async (req,res)=>{
    let success=false;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success,errors:errors.array()});
    }
    try{

        let user=await User.findOne({email:req.body.email});
        if(user){
            return res.status(400).json({success,error:"sorry a user with this email already exists"})
        }
        const salt=await bcrypt.genSalt(10);
        secpass=await bcrypt.hash(req.body.password,salt);
        user = await User.create({
            name:req.body.name,
            email:req.body.email,
            password:secpass,
        })
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        success=true;
        res.json({success,authtoken})
    }
    catch(error){
        console.error(error.message);
        res.status(500).send(success,"some error occured");
    }
    // .then(user=> res.json(user))
    // .catch(err=>{console.log(err)})
    // res.json({error:'please enter a unique value for email'})
})

//authenticate a user using:post "/api/auth/login". No login required

router.post("/login",[
    body("email","enter a valid email").isEmail(),
    body("password","password cannot be blank").exists(),
],async (req,res)=>{
    let success=false;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success,errors:errors.array()});
    }
    const {email,password}=req.body;
    try {
        let user =await User.findOne({email});
        if(!user){
            return res.status(400).json({success,error:"please try to login with correct credentials"});
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({success,error:"please try to login with correct credentials"});
        }
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        success=true;
        res.json({success,authtoken})
    } catch(error){
        console.error(error.message);
        res.status(500).send(success,"Internal server error");
    }
})

//Route 3: Get Logged in details of user using :Post "/api/auth/getuser". login required
router.post("/getuser",fetchuser,async (req,res)=>{
    try {
        userid=req.user.id;
        const user=await User.findById(userid).select("-password") 
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})

module.exports=router;