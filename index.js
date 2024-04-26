const express = require('express');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todoRoutes');
const path = require('path');
require('C:\\Users\\Umang Vadukar\\node_modules\\dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const mongourl = process.env.mongourl;

app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongourl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Mount todo routes
app.use('/todos', todoRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
