import Todo from "../models/todo.model.js";


export const createTodo = async (req, res) => {
    try {
        const { title } = req.body;

        if(!title) {
            return res.status(400).json({message: "Title is required" });
        }

        const newTodo = new Todo({
            title,
        });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};