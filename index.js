const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

//connect to mongooese
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected to db!')
);

//Middleware
app.use(express.json());

//Route Middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log('Server is up and running'));