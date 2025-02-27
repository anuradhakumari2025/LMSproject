const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./configs/mongodb');
require('dotenv').config();
const {clerkWebhooks} = require('./controllers/Webhook');
const  educatorRouter  = require('./routes/EducatorRoutes');
const {clerkMiddleware} = require('@clerk/express');
const { connectCloudinary } = require('./configs/cloudinary');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(clerkMiddleware())

// Connect to MongoDB
connectDB();
connectCloudinary()

app.get('/',(req,res)=>{
  res.send('Hello Anuradha')
})
app.post('/clerk',express.json(),clerkWebhooks)
app.use('/api/educator',express.json(),educatorRouter)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});