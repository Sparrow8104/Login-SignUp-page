const Users = require('../models/Users');
const crypto = require('crypto'); 

const verifyOtp = async (req, res, next) => {
  const { email, otp, token } = req.body;
  const formattedEmail = email.toLowerCase();

  try {
    const user = await Users.findOne({ email: formattedEmail });

    if (!user) {
      return next(createError("User not found", 400));
    }

    if (user.otp.otp !== otp || user.otp.token !== token) {
      return next(createError("Invalid OTP or token", 400));
    }

    if (new Date().getTime() > user.otp.expiryTime) {
      return next(createError("OTP has expired. Please request a new one.", 400));
    }

    
    const resetToken = crypto.randomBytes(32).toString('hex');
    
   
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date().getTime() + 30 * 60 * 1000; // 30 minutes expiry

    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully",
      resetToken, 
      status: true
    });

  } catch (error) {
    return next(error);
  }
};


const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = verifyOtp;
