const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./configs/mongodb');
require('dotenv').config();
const {clerkWebhooks, stripeWebhooks} = require('./controllers/Webhook');
const  educatorRouter  = require('./routes/EducatorRoutes');
const courseRouter = require('./routes/CourseRoutes');
const {clerkMiddleware} = require('@clerk/express');
const { connectCloudinary } = require('./configs/cloudinary');
const userRouter = require('./routes/UserRoutes');

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
app.use('/api/course',express.json(),courseRouter)
app.use('/api/user',express.json(),userRouter)
app.post('/stripe',express.raw({type: 'application/json'}),stripeWebhooks)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});