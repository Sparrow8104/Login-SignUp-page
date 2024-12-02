const Users =require('../models/Users')

const bcrypt = require('bcrypt');

const resetPassword = async (req, res, next) => {
    const { email, newPassword, confirmPassword} = req.body;

    try {
        const formattedEmail = email.toLowerCase();
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
