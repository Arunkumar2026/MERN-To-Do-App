import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Toaster, toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';

function App() {
  const [title,setTitle] = useState("");
  const [todos, setTodos] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const [isLoaded, setIsLoaded] = useState(false);

  const handleAdd = () => {
    if (!title.trim()){
      return toast.error("Task cannot be empty!");
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

  const handleDelete = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
    toast.success("Task Deleted");
  }

  const handleEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.title);
  }

  const handleSave = (id) => {
    if (!editText.trim()) {
      return toast.error("Task cannot be empty");
    }

    setTodos(
      todos.map((t) => 
        t.id === id ? {...t, title: editText.trim() } : t 
      )
    );

    setEditId(null);
    setEditText("");
    toast.success("Task Updated");
  };

  const handleCancel = () => {
    setEditId(null);
    setEditText("");
  };

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");

    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
        
      } catch (error) {
        console.error("Invalid JSON in localstorage", error);
        localStorage.removeItem("todos");
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if(isLoaded){
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, isLoaded]);
  

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

        {todos.length === 0 && (
          <p className='text-center text-gray-500 p-4 mt-4 font-semibold text-lg'>No tasks yet</p>
        )}

        <div className='space-y-2'>
          {todos.map((todo) => (
            <div key={todo.id} className='flex justify-between items-start bg-base-200 p-3 my-2 rounded-lg'>

              {editId === todo.id ? (
                <input type="text" className='input input-bordered w-full' value={editText} onChange={(e) => setEditText(e.target.value)} />
              ) : (<span className='flex-1 break-words'>{todo.title}</span>)}

              <div className='flex flex-row sm:flex-col gap-2 ml-2 shrink-0'>
                {editId === todo.id ? (
                  <>
                  <button className='btn btn-sm btn-success' onClick={() => handleSave(todo.id)}>Save</button>
                  <button className='btn btn-sm' onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <button className='btn btn-sm btn-warning mr-1' onClick={() => handleEdit(todo)}>
                    
                    <FontAwesomeIcon icon={faEdit}/> Edit
                    </button>
                )}
              <button className='btn btn-sm btn-error'onClick={() => handleDelete(todo.id)}>
                <FontAwesomeIcon icon={faTrash} /> Delete</button>
              </div>
            </div>
          ))}
        </div> 
      </div>
     <Toaster/>
    </div>
  )
}

export default App