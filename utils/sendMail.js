const nodemailer=require('nodemailer')



const sendMail = (otp,email)=>{

  try {
    

    const transport =nodemailer.createTransport({
        service:'GMAIL',
        auth:{
            user: process.env.EMAIL,
            pass:process.env.EMAIL_PASSWORD
        }
       })
 

       const mailOptions ={
            from:process.env.EMAIL,
            to:email,
            subject:'reset password otp',
            html:`<div>${otp}</div>`,
       }
    

       transport.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.error('Error in sending email:', error);  // Log the error
            throw new Error('Failed to send email');
        }else{
            console.log('Email sent:', info.response); 
        }
       })
  } catch (error) {
    console.log('Error in sendMail function:', error.message);
  }
}


module.exports=sendMail