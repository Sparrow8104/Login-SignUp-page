const Users = require('../models/Users');
const jwt = require('jsonwebtoken');

const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;  

  try {
    const formattedEmail = email.toLowerCase();
    const user = await Users.findOne({ email: formattedEmail });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 400;
      throw error;
    }

    
    if (user.otp.otp !== otp) {
      const error = new Error("Invalid OTP");
      error.statusCode = 400;
      throw error;
    }

   
    if (Date.now() > user.otp.expiryTime) {
      const error = new Error("OTP has expired");
      error.statusCode = 400;
      throw error;
    }

   
    const resetToken = jwt.sign(
      { email: formattedEmail },  
      process.env.JWT_SECRET,    
      { expiresIn: '1h' }          
    );

    res.status(200).json({
      message: "OTP verified successfully",
      resetToken,  
      status: true
    });
  } catch (error) {
    next(error);
  }
};

module.exports = verifyOtp;
