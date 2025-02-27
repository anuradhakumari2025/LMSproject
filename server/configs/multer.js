const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({});

// Initialize upload
const upload = multer({
  storage,
}); 

module.exports = upload;
