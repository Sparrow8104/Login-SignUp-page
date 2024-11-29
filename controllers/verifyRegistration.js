const User = require('../models/User');

const bcrypt = require('bcrypt');

const verifyRegistration = async (req, res, next) => {
  const { email, otp, token } = req.body;

  try {
    const formatedEmail = email.toLowerCase();

    const user = await User.findOne({ email: formatedEmail });
    if (!user) {
      const error = new Error('No user found');
      error.statusCode = 400;
      throw error;
    }

    const { otp: storedOtp, sendTime, token: storedToken } = user.otp;
    if (otp !== storedOtp || token !== storedToken || new Date().getTime() > sendTime) {
      const error = new Error('Invalid or expired OTP');
      error.statusCode = 400;
      throw error;
    }

  
    user.password = await bcrypt.hash(user.password, 10);

   
    user.otp = { otp: null, sendTime: null, token: null }; 
    console.log(otp)
    await user.save();

    res.status(200).json({ message: 'User registered successfully', status: true });
  } catch (error) {
    next(error);
  }
};

module.exports = verifyRegistration;