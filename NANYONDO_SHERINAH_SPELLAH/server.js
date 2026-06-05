const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/videx')
  .then(() => console.log('🚀 Successfully connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));


const videoRouter = require('./routes/videoRoutes');
app.use('/', videoRouter);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});