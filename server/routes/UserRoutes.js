const express = require('express')
const { getUserData, userEnrolledCourses, purchaseCourse, updateUserCourseProgress, getUserCourseProgress, addUserRating, verifyPayment } = require('../controllers/UserController')
const { razorpayWebhook } = require("../controllers/Webhook");


const userRouter = express.Router()

userRouter.get('/data',getUserData)
userRouter.get('/enrolled-courses',userEnrolledCourses)
userRouter.post('/purchase-course',purchaseCourse)
userRouter.post('/verify-payment',verifyPayment)
userRouter.post("/razorpay-webhook", express.json(), razorpayWebhook);
userRouter.post('/update-course-progress',updateUserCourseProgress)
userRouter.post('/get-course-progress',getUserCourseProgress)
userRouter.post('/add-rating',addUserRating)

module.exports = userRouter
