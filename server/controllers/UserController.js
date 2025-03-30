const User = require("../models/User");
const Stripe = require("stripe");
const Razorpay = require("razorpay");
const Course = require("../models/Course");
const Purchase = require("../models/Purchase");

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

// module.exports.purchaseCourse = async (req, res) => {
//   try {
//     const { courseId } = req.body;
//     const { origin } = req.headers;
//     const userId = req.auth.userId;
//     const userData = await User.findById(userId);

//     const courseData = await Course.findById(courseId);

//     if (!userData || !courseData) {
//       return res.json({ success: false, message: "Data not found" });
//     }
//     const purchaseData = {
//       courseId: courseData._id,
//       userId,
//       amount: (
//         courseData.coursePrice -
//         (courseData.discount * courseData.coursePrice) / 100
//       ).toFixed(2),
//     };

//     const newPurchase = await Purchase.create(purchaseData);

//     //stripe payment gateway
//     const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
//     const currency = process.env.CURRENCY.toLowerCase();
//     const line_items = [
//       {
//         price_data: {
//           currency,
//           product_data: {
//             name: courseData.courseTitle,
//           },
//           unit_amount: Math.floor(newPurchase.amount) * 100,
//         },
//         quantity: 1,
//       },
//     ];

//     const session = await stripeInstance.checkout.sessions.create({
//       payment_method_types: ["card"],
//       success_url: `${origin}/success`,
//       cancel_url: `${origin}/cancel`,
//       line_items: line_items,
//       mode: "payment",
//       metadata: {
//         purchaseId: newPurchase._id.toString(),
//       },
//     });
//     console.log(session)
//     res.json({ success: true, session_url: session.url });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };




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