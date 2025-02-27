const { clerkClient } = require("@clerk/express");

module.exports.protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const response = await clerkClient.users.getUser(userId);
    if (response.publicMetadata.role !== "educator") {
      return res.json({ success: false, message: "Unauthorized Access" });
    }
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
