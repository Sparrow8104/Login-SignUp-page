const User=require('../models/User')
const crypto = require('crypto');
const sendMail = require('../utils/sendMail');
const bcrypt=require('bcrypt')
const joi=require("joi")

const register=async(req,res,next)=>{

    const {error:validationError} =validateUser(req.body)
    const{name,email,password}=req.body
    console.log(req.body);
    try{
        if(validationError){
          console.log(validationError)
          const error=new Error(validationError.details[0].message)
          error.statusCode=400
          throw error
        }
        const formatedName=name.toLowerCase()
        const formatedEmail=email.toLowerCase()

        const finderUser=await User.findOne({email:formatedEmail})
        if(finderUser){
                const error=new Error('this email already exists')
                error.statusCode=400
                throw error
            
        }
        const otp = Math.floor(Math.random() * 900000) + 100000;
        console.log(otp)
    const token = crypto.randomBytes(32).toString('hex');
    const otpExpirationTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now

    const newUser = new User({
      name: formatedName,
      email: formatedEmail,
      password, 
      otp: {
        otp,
        sendTime: otpExpirationTime,
        token,
      },
    });
    await newUser.save();

    sendMail(otp, formatedEmail);

    res.status(200).json({
      message: 'OTP sent to your email. Please verify to complete registration.',
      status: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};
      

module.exports=register



function validateUser(data){


    const userSchema =joi.object({
        name:joi.string().min(2).required().messages({
      "string.base": "Name must be a string.",
      "string.min": "Name length should be at least 2.",
      "any.required": "Name is required.",
        }),
        email:joi.string().email().required(),
        password:joi.string().min(6).max(12).required().messages({
      "string.min": "Password must be at least 6 characters long.",
      "string.max": "Password must not exceed 12 characters.",
      "any.required": "Password is required.",
        }),
         
    } );

    return userSchema.validate(data)
}


