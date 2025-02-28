const express = require('express')
const { getAllCourses, getCourseId } = require('../controllers/CourseController')

const courseRouter = express.Router()

courseRouter.get('/all',getAllCourses)
courseRouter.get('/:id',getCourseId)

module.exports = courseRouter
