require('dotenv').config();
const express=require('express')
const cors =require('cors')
const mongoose=require("mongoose")

const app =express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true,limit:"50mb"}))


const getConnection= async() =>{
    try {
        console.log(process.env.MONGO_URI)
       await mongoose
        .connect(process.env.MONGO_URI);
                    console.log('db is connected')
        }
        catch(error) {
            console.log(error);
            process.exit(1);
        }
    }
getConnection();
app.listen(process.env.PORT,() => console.log('server is running on port :'+process.env.PORT))