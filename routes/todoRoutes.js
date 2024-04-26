const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

// GET route to retrieve all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET route to retrieve a specific todo by ID
router.get('/:id', getTodo, (req, res) => {
    res.json(res.todo);
});

// POST route to add a new todo
router.post('/', async (req, res) => {
    const todo = new Todo({
        title: req.body.title,
        description: req.body.description
    });
    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT route to update a todo
router.put('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (req.body.title != null) {
            todo.title = req.body.title;
        }
        if (req.body.description != null) {
            todo.description = req.body.description;
        }

        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, { title: todo.title, description: todo.description }, { new: true });
        res.json(updatedTodo);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// DELETE route to delete a todo
router.delete('/:id', getTodo, async (req, res) => {
    try {

        todos = await Todo.findByIdAndDelete(req.params.id);
        res.json(todos)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getTodo(req, res, next) {
    let todo;
    try {
        todo = await Todo.findById(req.params.id);
        if (todo == null) {
            return res.status(404).json({ message: 'Todo not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.todo = todo;
    next();
}

module.exports = router;
