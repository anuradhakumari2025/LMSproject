const User = require("../models/User");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Course = require("../models/Course");
const Purchase = require("../models/Purchase");
const CourseProgress = require("../models/CourseProgress");

module.exports.getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports.userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userData = await User.findById(userId).populate("enrolledCourses");
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports.purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.auth.userId;

    const courseData = await Course.findById(courseId);
    if (!courseData) {
      return res.json({ success: false, message: "Course not found" });
    }

    const amount = (
      courseData.coursePrice -
      (courseData.discount * courseData.coursePrice) / 100
    ).toFixed(2);

    // Create a new purchase entry in the database
    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: parseFloat(amount),
    };

    const newPurchase = await Purchase.create(purchaseData);

    // Initialize Razorpay instance
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    // Create an order in Razorpay
    const options = {
      amount: Math.floor(newPurchase.amount * 100), // Amount in paise
      currency: "INR",
      receipt: newPurchase._id.toString(),
    };

    const order = await razorpayInstance.orders.create(options);

    // Update the purchase record with the Razorpay order ID
    newPurchase.razorpayOrderId = order.id;
    await newPurchase.save();

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.json({ success: false, message: error.message });
  }
};

module.exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.json({ success: false, message: "Invalid payment data" });
    }

    // Generate the expected signature using Razorpay's algorithm
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    // Compare the generated signature with the received signature
    if (generatedSignature !== signature) {
      return res.json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Update the purchase status in the database
    const purchaseData = await Purchase.findOne({ razorpayOrderId: orderId });
    if (!purchaseData) {
      return res.json({ success: false, message: "Purchase not found" });
    }

    purchaseData.status = "completed";
    await purchaseData.save();

    // Update the user's enrolled courses
    const user = await User.findById(purchaseData.userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.enrolledCourses.includes(purchaseData.courseId)) {
      user.enrolledCourses.push(purchaseData.courseId);
      await user.save();
    }

    // Update the course's enrolled students
    const course = await Course.findById(purchaseData.courseId);
    if (!course) {
      return res.json({ success: false, message: "Course not found" });
    }

    if (!course.enrolledStudents.includes(user._id)) {
      course.enrolledStudents.push(user._id);
      await course.save();
    }

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.json({ success: false, message: error.message });
  }
};

module.exports.updateUserCourseProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;
    const userId = req.auth.userId;

    const progressData = await CourseProgress.findOne({ userId, courseId });
    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "Lecture already completed",
        });
      }
      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({
      success: true,
      message: "Course progress updated successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports.getUserCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.auth.userId;
    const progressData = await CourseProgress.findOne({ userId, courseId });
    // console.log("Progress Data ",progressData)
    if (!progressData) {
      return res.json({ success: false, message: "No progress data found" });
    } else {
      return res.json({ success: true, progressData });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Add user ratings to course
module.exports.addUserRating = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, rating } = req.body;
    if (!userId || !courseId || !rating || rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Invalid data" });
    }
    const courseData = await Course.findById(courseId);
    if (!courseData) {
      return res.json({ success: false, message: "Course not found" });
    }
    const userData = await User.findById(userId);
    if (!userData || !userData.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: "User has not purchased this course",
      });
    }
    const existingRatingIndex = courseData.courseRating.findIndex(
      (rating) => rating.userId === userId
    );
    if (existingRatingIndex > -1) {
      courseData.courseRating[existingRatingIndex].rating = rating;
    } else {
      courseData.courseRating.push({ userId, rating });
    }

    await courseData.save();
    res.json({ success: true, message: "Rating added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
