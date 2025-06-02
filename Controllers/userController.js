const Users=require('../Models/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config();

const getRandomAvatar = require("../Utils/avatar");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(403).json({
        success: false,
        message: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = getRandomAvatar(); 

    const user = await Users.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });
    return res.status(200).json({
      success: true,
      message: `User registration Successful`,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `User registration failed ${error.message}`,
    });
  }
};

exports.loginUser=async(req,res)=>{
    try{
       const{email,password}=req.body;
       if(!email||!password){
        return res.status(403).json({
            success:false,
            message:"All fields required",
        });
       }
      const user=await Users.findOne({email});
      if(!user){
        return res.status(401).json({
            success:false,
            message:"User does not exixts",
        });
       }
       if(bcrypt.compare(password,user.password)){
          const payload={
            email:user.email,
            id:user._id
          }
          const token=jwt.sign(payload,process.env.JWT_SECRETKEY,{
            expiresIn:"1h",
          })
          const userDetails={
            _id:user._id,
            name:user.name,
            email:user.email,
          }
          const options={
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
          };
          console.log(userDetails);
          return res.cookie("token",token,options).status(200).json({
            success:true,
            user:userDetails,
            message:"Logged in Successfully"
        })
       }
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`User authentication failed ${error.message}`,
           
        })
    }
}
exports.logout=async(req,res)=>{
    try{
        return(
            res.status(200).cookie("token",'',{maxAge:0}).json({
              message:"Logged out successfully",
              success:true,
            })
        )
    }catch(error){
       console.log(error);
       return(
        res.status(500).json({
           message:'Internal server error',
           success:false,
        })
       )
    }
}

const passport = require("passport");

exports.googleLoginSuccess = (req, res) => {
  console.log('User in req:', req.user);
  if (req.user) {
    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: req.user,
    });
  } else {
    return res.status(403).json({
      success: false,
      message: "Not Authorized",
    });
  }
};


exports.googleLoginFailed = (req, res) => {
  return res.status(401).json({
    success: false,
    message: "Login Failed",
  });
};


exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] 
});

exports.googleAuthCallback = passport.authenticate("google", {
  failureRedirect: "/user/login/failed", 
  successRedirect: process.env.CLIENT_URL,
});

