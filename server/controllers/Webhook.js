const { Webhook } = require("svix");
const User = require("../models/User");
const Purchase = require("../models/Purchase");
const crypto = require("crypto");
const Course = require("../models/Course");
const Stripe = require("stripe");

//API Controller function to Manage Clerk User with db
module.exports.clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.second_name,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        res.json({});
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_address[0].email_address,
          name: data.first_name + " " + data.second_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }

      default:
        break;
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// module.exports.stripeWebhooks = async (request, response) => {
//   console.log("🔔 Webhook received:", request.headers);

//   const sig = request.headers["stripe-signature"];
//   let event;
//   try {
//     event = stripeInstance.webhooks.constructEvent(
//       request.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//     console.log("✅ Webhook verified:", event.type);
//   } catch (error) {
//     console.log(error);
//     return response.status(400).send(`Webhook Error: ${error.message}`);
//   }
//   console.log("🔄 Processing event:", event.type);

//   // Handle the event
//   switch (event.type) {
//     case "payment_intent.succeeded": {
//       console.log("💰 Payment succeeded!");

//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id;

//       const session = await stripeInstance.checkout.sessions.list({
//         payment_intent: paymentIntentId,
//       });

//       console.log("📝 Session Data:", session);

//       if (!session.data.length) {
//         console.error("❌ No session found!",paymentIntentId);
//         return;
//       }


//       if (!session.data.length || !session.data[0].metadata.purchaseId) {
//         console.error("❌ No valid purchaseId found in session metadata!");
//         return response.status(400).send("No valid purchaseId found!");
//       }
      

//       const { purchaseId } = session.data[0].metadata;
//       if (!purchaseId) {
//         console.error("❌ No purchaseId found in session metadata!");
//         return;
//       }
//       console.log(purchaseId);

//       const purchaseData = await Purchase.findById(purchaseId);
//       if (!purchaseData) {
//         console.error("❌ Purchase not found for purchaseId:", purchaseId);
//         return;
//       }
//       console.log("🔄 Updating purchase status to 'completed'...");

//       const userData = await User.findById(purchaseData.userId);
//       const courseData = await Course.findById(
//         purchaseData.courseId.toString()
//       );
//       courseData.enrolledStudents.push(userData);
//       await courseData.save();

//       userData.enrolledCourses.push(courseData._id);
//       await userData.save();
//       console.log("purchase data before save ", purchaseData);
//       purchaseData.status = "completed";
//       await purchaseData.save();
//       console.log("purchase data after save ", purchaseData);
//       break;
//     }
//     case "payment_intent.payment_failed": {
//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id;
//       // const session = await stripeInstance.checkout.sessions.list({
//       //   payment_intent: paymentIntentId,
//       // });

//       const session = await stripeInstance.checkout.sessions.retrieve(paymentIntentId);

//       const { purchaseId } = session.data[0].metadata;
//       const purchaseData = await Purchase.findById(purchaseId);
//       if (!purchaseData) {
//         console.error("❌ Purchase not found for purchaseId:", purchaseId);
//         return;
//       }
//       purchaseData.status = "failed";
//       await purchaseData.save();
//       break;
//     }
//     // # ... handle other event types
//     default:
//       console.log(`Unhandled event type: ${event.type}`);
//   }
//   response.json({ received: true });
// };



module.exports.razorpayWebhook = async (req, res) => {
  try {
    console.log("Webhook Payload:", JSON.stringify(req.body, null, 2));

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify the webhook signature
    const signature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const { payload } = req.body;

    if (payload.payment.entity.status === "captured") {
      const purchaseId = payload.payment.entity.notes.purchaseId;
      const purchaseData = await Purchase.findById(purchaseId);

      if (purchaseData) {
        purchaseData.status = "completed";
        await purchaseData.save();
        console.log("✅ Purchase status updated to 'completed':", purchaseData);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error handling Razorpay webhook:", error);
    res.json({ success: false, message: error.message });
  }
};