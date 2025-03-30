const { Webhook } = require("svix");
const User = require("../models/User");
const Purchase = require("../models/Purchase");
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

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports.stripeWebhooks = async (request, response) => {
  console.log("🔔 Webhook received:", req.headers);

  const sig = request.headers["stripe-signature"];
  let event;
  try {
    event = Stripe.Webhook.construct_event(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Webhook verified:", event.type);
  } catch (error) {
    console.log(error);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }
  console.log("🔄 Processing event:", event.type);

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      console.log("💰 Payment succeeded!");

      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      console.log("📝 Session Data:", session);

      if (!session.data.length) {
        console.error("❌ No session found!");
        return;
      }
      const { purchaseId } = session.data[0].metadata;

      console.log(purchaseId);

      const purchaseData = await Purchase.findById(purchaseId);
      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(
        purchaseData.courseId.toString()
      );
      courseData.enrolledStudents.push(userData);
      await courseData.save();

      userData.enrolledCourses.push(courseData._id);
      await userData.save();
      console.log("purchase data before save ", purchaseData);
      purchaseData.status = "completed";
      await purchaseData.save();
      console.log("purchase data after save ", purchaseData);
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { purchaseId } = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId);
      purchaseData.status = "failed";
      await purchaseData.save();
      break;
    }
    // # ... handle other event types
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  response.json({ received: true });
};
