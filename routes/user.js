const express=require('express')
const register=require('../controllers/register')
const login=require('../controllers/login')
const forgetPassword=require('../controllers/forgetPasssword')
const verifyRegistration = require('../controllers/verifyRegistration')
const verifyOtp=require('../controllers/verifyOtp.js')
const resetPassword=require('../controllers/resetPassword')
const setUserName=require('../controllers/userName')
const submitSurvey = require('../controllers/surveyControllers')

const router=express.Router()

router.post('/register',register)
router.post('/register/verify', verifyRegistration);
router.post('/login',login)
router.post('/forget/password',forgetPassword)
router.post('/otp/verify',verifyOtp)
router.post('/reset/password',resetPassword)
router.post('/set/username',setUserName)
router.post('/submit-survey', submitSurvey);



module.exports=router