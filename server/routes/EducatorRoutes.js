const express = require('express')
const {updateRoleToEducator, addCourse, getEducatorCourses, getEducatorDashboardData, getEnrolledStudentsData} = require('../controllers/EducatorController')
const upload = require('../configs/multer')
const { protectEducator } = require('../middlewares/authMiddleware')
const educatorRouter = express.Router()

//Add educator role
educatorRouter.get('/update-role',updateRoleToEducator)
educatorRouter.post('/add-course',upload.single('image'),protectEducator,addCourse)
educatorRouter.get('/courses',protectEducator,getEducatorCourses)
educatorRouter.get('/dashboard',protectEducator,getEducatorDashboardData)
educatorRouter.get('/enrolled-students',protectEducator,getEnrolledStudentsData)

module.exports = educatorRouter;