const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
},{versionKey:false});

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;