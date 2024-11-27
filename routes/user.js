const express=require('express')
const register=require('../controllers/register')
const login=require('../controllers/login')
const forgetPassword=require('../controllers/forgetPasssword')
const verifyRegistration = require('../controllers/verifyRegistration');

const router=express.Router()

router.post('/register',register)
router.post('/register/verify', verifyRegistration);
router.post('/login',login)
router.post('/forget/password',forgetPassword)

module.exports=router