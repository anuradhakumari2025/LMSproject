const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("MongoDB database connection established successfully")
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/lms`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = connectDB;
