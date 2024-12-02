const Users = require('../models/Users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const resetPassword = async (req, res, next) => {
    const { resetToken, newPassword, confirmPassword } = req.body;
  
    try {
      const user = await Users.findOne({ resetToken });
  
      if (!user) {
        const error = new Error("Invalid or expired token.");
        error.statusCode = 400;
        throw error;
      }
  
      
      if (new Date().getTime() > user.resetTokenExpiry) {
        const error = new Error("Reset token has expired. Please request a new one.");
        error.statusCode = 400;
        throw error;
      }
  
      if (newPassword !== confirmPassword) {
        const error = new Error("Passwords do not match.");
        error.statusCode = 400;
        throw error;
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
  
    
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
  
      await user.save();
  
      res.status(200).json({ message: "Password reset successful", status: true });
    } catch (error) {
      next(error);
    }
  };
  
module.exports = resetPassword;
