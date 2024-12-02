const Users =require('../models/Users')
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt');

const resetPassword = async (req, res, next) => {
    const { resetToken, newPassword, confirmPassword} = req.body;

    try {
        console.log('Received resetToken:', resetToken);
        let decodedToken
        try {
            decodedToken=jwt.verify(resetToken, process.env.JWT_SECRET);
            console.log('Decoded Payload:', decodedToken);
        }catch (err) {
            console.error('Error during token verification:', err);  
            if (err.name === "TokenExpiredError") {
                const error = new Error("Token has expired. Please request a new one.");
                error.statusCode = 400;
                throw error;
            } else if (err.name === "JsonWebTokenError") {
                const error = new Error("Invalid token. Please check the token.");
                error.statusCode = 400;
                throw error;
            } else {
                const error = new Error("Error during token verification.");
                error.statusCode = 400;
                throw error;
            }
        }

        const formattedEmail = decodedToken.email;

        const user = await Users.findOne({ email: formattedEmail });

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 400;
            throw error;
        }

        if (newPassword !== confirmPassword) {
            const error = new Error("Passwords do not match");
            error.statusCode = 400;
            throw error;
        }
       
        if(newPassword.length<6){
            const error=new Error('Password should at least have six digits')
            error.statusCode=400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        user.otp = { otp: null, sendTime: null, token: null };

        await user.save();

        res.status(200).json({ message: "Password reset successful", status: true });
    } catch (error) {
        next(error);
    }
};

module.exports = resetPassword;
