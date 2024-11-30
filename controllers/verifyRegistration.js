const User = require('../models/User');
const bcrypt=require('bcrypt')
const { getPendingUser, removePendingUser } = require('../utils/pendingUsers'); 


const verifyOtp = async (req, res, next) => {
  const { email, otp, token } = req.body;
  const formattedEmail = email.toLowerCase();
  const pendingUser = getPendingUser(formattedEmail);

  try {
  
    if (!pendingUser) {
      const error = new Error('No pending registration found for this email.');
      error.statusCode = 400;
      throw error;
    }

    if (Date.now() > pendingUser.otpExpirationTime) {
      const error = new Error('OTP has expired. Please request a new one.');
      error.statusCode = 400;
      throw error;
    }

 
    if (pendingUser.otp !== parseInt(otp, 10)) {
      const error = new Error('Invalid OTP.');
      error.statusCode = 400;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(pendingUser.password, 10);
   
    const newUser = new User({
      name: pendingUser.name,
      email: formattedEmail,
      password:hashedPassword, 
    });

    await newUser.save();

   
    removePendingUser(formattedEmail);

    res.status(200).json({
      message: 'Registration successful!',
      status: true,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = verifyOtp;
