const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({

    name: {type:String,required:true},
    email:{type:String ,required:true,unique:true},
    password:{type:String,required:function () { return this.otp.otp === null; } },
    otp:{
        otp:{type:String,default:null},
        sendTime:{type:Number,default:null},
        token:{type:String,default:null}
    }
},{timestamps:true});


module.exports=mongoose.model('User',userSchema)