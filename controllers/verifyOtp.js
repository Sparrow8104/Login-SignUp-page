const Users = require('../models/Users');

const verifyOtp = async (req, res, next) => {
  const { email, otp, token } = req.body; 

  try {
    const formattedEmail = email.toLowerCase();

   
    const user = await Users.findOne({ email: formattedEmail });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 400; 
      throw error;
    }

   
    if (!user.otp.otp || user.otp.otp !== otp || user.otp.token !== token) {
      const error = new Error("Invalid OTP or token");
      error.statusCode = 400; 
      throw error;
    }

  
    if (new Date().getTime() > user.otp.expiryTime) {
      const error = new Error("OTP has expired. Please request a new one.");
      error.statusCode = 400; 
      throw error;
    }

 
    res.status(200).json({ message: "OTP verified successfully", status: true });

  } catch (error) {
    next(error); 
  }
};

module.exports = verifyOtp;
