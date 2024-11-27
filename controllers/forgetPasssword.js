const User=require('../models/User')
const crypto=require('crypto')
const sendMail=require('../utils/sendMail')
const forgetPassword=async(req,res,next) =>{
   

    const {email}=req.body

    try {

        const formatedEmail=email.toLowerCase()

        const finderUser=await User.findOne({email:formatedEmail})
        
        if(!finderUser){
            const error=new Error("no user found")
            error.statusCode=400
            throw error
        }

        if(finderUser.otp.otp &&new Date(finderUser.otp.sendTime).getTime()>new Date().getTime()){
            const error=new Error(
                `please wait until ${new Date(
                    finderUser.otp.sendTime
                ).toLocaleDateString()}`)

                error.statusCode=400
                throw error
        }


         const otp=Math.floor(Math.random()*90000)+100000
         console.log(otp)

        const token=crypto.randomBytes(32).toString('hex')

         finderUser.otp.otp=otp
         finderUser.otp.sendTime=new Date().getTime()
         finderUser.otp.token=token

        await finderUser.save()
        sendMail(otp,formatedEmail)
        res.status(200).json({message:'otp sent to your email',status:true,token })

    } catch (error) {
        next(error)
    }
}


module.exports=forgetPassword