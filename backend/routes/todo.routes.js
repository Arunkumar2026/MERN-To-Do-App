import express from "express";
import { createTodo, getTodos, updateTodo, deleteTodo } from "../controllers/todo.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
