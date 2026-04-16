import Todo from "../models/todo.model.js";


export const createTodo = async (req, res) => {
    try {
        const { title } = req.body;

        if(!title) {
            return res.status(400).json({message: "Title is required" });
        }

        const newTodo = await Todo.create({
            title,
            user: req.user._id
        });
        res.status(201).json(newTodo);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user._id });
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({message: error.message });
    }
};

export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const updateTodo = await Todo.findOneAndUpdate(
            { _id:id, user: req.user._id },
            req.body,
            { new: true}

        );
        
        if(!updateTodo){
            return res.status(404).json({message: "Todo not found" });
        }

        res.status(200).json(updateTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteTodo = await Todo.findOneAndDelete({
            _id: id,
            user:req.user._id,
        });

        if(!deleteTodo){
            return res.status(404).json({message: "Todo not found" });
        }

        res.status(200).json({message: "Todo deleted successfully" });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};