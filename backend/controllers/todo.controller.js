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

export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find();

        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({message: error.message });
    }
};

export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const updateTodo = await Todo.findByIdAndUpdate(
            id,
            req.body,
            { new: true}

        );
        
        if(!updateTodo){
            return res.status(404).json({message: "Todo not found" });
        }

        res.status(200).json({updateTodo});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteTodo = await Todo.findByIdAndDelete(id);

        if(!deleteTodo){
            res.status(404).json({message: "Todo not found" });
        }

        res.status(200).json({message: "Todo deleted successfully" });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};