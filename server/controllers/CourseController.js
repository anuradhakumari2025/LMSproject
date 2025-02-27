const Course = require("../models/Course");
module.exports.getAllCourses = async(req,res)=>{
  try {
    
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}