const { clerkClient } = require("@clerk/express");
const Course = require("../models/Course");
const { v2: cloudinary } = require("cloudinary");
const Purchase = require("../models/Purchase");

module.exports.updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });
    res.json({ success: true, message: "You can publish a course now" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports.addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.json({ success: false, message: "Thumbnail not attached" });
    }
    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
    const newCourse = await Course.create(parsedCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    res.json({ success: true, message: "Course Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports.getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    res.json({ success: true, courses });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports.getEducatorDashboardData = async(req,res)=>{
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length
    
    const courseIds = courses.map(course =>course._id)
    const purchases = await Purchase.find({
      courseId:{$in:courseIds},
      status:"completed"
    })

    const totalEarnings = purchases.reduce((sum , purchase)=>sum + purchase.amount,0)

    //collect unoque enrolled student ids with their course titles
    const enrolledStudentsData = [];
    for(const course of courses){
      const students = await User.find({
        _id:{$in:course.enrolledStudents}
      },'name imageUrl')

      students.forEach(student =>{
        enrolledStudentsData.push({
          courseTitle:course.courseTitle,
          student
        })
      })
    }

    res.json({success:true,dashBoardData:{
      totalEarnings,enrolledStudentsData,totalCourses
    }})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

module.exports.getEnrolledStudentsData = async(req,res)=>{
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map(course =>course._id)
    const purchases = await Purchase.find({
      courseId:{$in:courseIds},
      status:"completed"
    }).populate('userId','name imageUrl').populate('courseId' , 'courseTitle')

    const enrolledStudents = purchases.map(purchase=>({
      student:purchase.userId,
      courseTitle:purchase.courseId.courseTitle,
      purchaseData:purchase.createdAt
    }))

    res.json({success:true,enrolledStudents})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}
