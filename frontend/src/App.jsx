
import { Toaster, toast } from 'react-hot-toast';
import { useState } from 'react';

function App() {
  const [title,setTitle] = useState("");
  const [todos, setTodos] = useState([]);

  const handleAdd = () => {
    if (!title.trim()){
      return toast.error("Enter a task");
    }

    const newTodo = {
      id: Date.now(),
      title,
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setTitle("");
    toast.success("Task added!");
  }
  

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 flex items-center justify-center'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-6'>
        <h1 className='text-2xl font-bold text-center mb-6'>
          Todo App
        </h1>

        <div className='flex gap-2'>
          <input type="text"
            placeholder='Add a new task...'
            className='input input-bordered w-full'
            value={title}
            onChange={(e) => setTitle(e.target.value)} />

            <button className='btn btn-primary' onClick={handleAdd}>Add</button>
        </div>

        <div className='space-y-2'>
          {todos.map((todo) => (
            <div key={todo.id} className='flex justify-between items-center bg-base-200 p-3 my-2 rounded-lg'>
              <span>{todo.title}</span>

              <button className='btn btn-sm btn-error'
                onClick={() => setTodos(todos.filter((t) => t.id !== todo.id))}>Delete</button>
            </div>
          ))}
        </div> 
      </div>
     <Toaster/>
    </div>
  )
}

export default App