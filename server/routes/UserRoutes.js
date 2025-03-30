const express = require('express')
const { getUserData, userEnrolledCourses, purchaseCourse } = require('../controllers/UserController')
const { razorpayWebhook } = require("../controllers/Webhook");


const userRouter = express.Router()

userRouter.get('/data',getUserData)
userRouter.get('/enrolled-courses',userEnrolledCourses)
userRouter.post('/purchase-course',purchaseCourse)
userRouter.post("/razorpay-webhook", express.json(), razorpayWebhook);

module.exports = userRouter
