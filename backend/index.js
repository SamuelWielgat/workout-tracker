require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/user');

// express app
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/user', userRoutes);
app.get('/', async (req, res) => {
  res.send('Server is working on');
});

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 4001;
    app.listen(PORT, () => {
      console.log('connected to db & listening on port', PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
