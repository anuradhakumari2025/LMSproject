const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./configs/mongodb');
require('dotenv').config();
const {clerkWebhooks} = require('./controllers/Webhook')

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
// app.use(bodyParser.json());

// Connect to MongoDB
connectDB();


// Routes
// const coursesRouter = require('./routes/courses');
// const usersRouter = require('./routes/users');

// app.use('/courses', coursesRouter);
// app.use('/users', usersRouter);

app.get('/',(req,res)=>{
  res.send('hello world')
})
app.post('/clerk',express.json(),clerkWebhooks)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});