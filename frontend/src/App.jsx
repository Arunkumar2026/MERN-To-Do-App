import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Toaster, toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import Login from './Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [title,setTitle] = useState("");
  const [todos, setTodos] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch("https://to-do-backend-pxvm.onrender.com/api/todos", {
      headers: {
        Authorization: token,
      },
    })
    .then(res => {
      if(!res.ok){
        throw new Error("Unauthorized");
      }
      return res.json();
    })
    .then(data => {
      setTodos(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch(() => {
      toast.error("Session expored. Please login again.");
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setLoading(false);
    })
  }, []);


  const handleAdd = () => {
    if (!title.trim()){
      return toast.error("Task cannot be empty!");
    }

    fetch("https://to-do-backend-pxvm.onrender.com/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ title }),
    })
    .then(res => res.json())
    .then(newTodo => {
      setTodos([newTodo, ...todos]);
      setTitle("");
      toast.success("Task added!");
    })
    .catch(() => toast.error("Error adding task"));
  };

  const handleDelete = (id) => {
    fetch(`https://to-do-backend-pxvm.onrender.com/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token"),
      }
    })
    .then(() => {
      setTodos(todos.filter(t => t._id !== id));
      toast.success("Task Deleted");
    })
    .catch(() => toast.error("Error deleting"));
  }

  const handleEdit = (todo) => {
    setEditId(todo._id);
    setEditText(todo.title);
  }

  const handleSave = (id) => {
    if (!editText.trim()) {
      return toast.error("Task cannot be empty");
    }

    fetch(`https://to-do-backend-pxvm.onrender.com/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ title: editText }),
    })
    .then(() => {
      setTodos(
        // todos.map(t => t._id === id ? { ...t, title: editText.trim() } : t)
        Array.isArray(todos) && todos.map(t => t._id === id ? { ...t, title: editText.trim() } : t)
      );

      setEditId(null);
      setEditText("");
      toast.success("Task updated");
    })
    .catch(() => toast.error("Error updating"));
  };

  const handleCancel = () => {
    setEditId(null);
    setEditText("");
  };
  
  if(!isAuthenticated){
    return <Login setIsAuthenticated={setIsAuthenticated} /> 
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 flex items-center justify-center'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-6'>

        <button
        className='btn btn-sm btn-error mb-4'
        onClick={() => {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }}
        >Logout</button>
        <h1 className='text-2xl font-bold text-center mb-6'>
          Todo App
        </h1>

        <div className='flex gap-2'>
          <input type="text"
            placeholder='Add a new task...'
            className='input input-bordered w-full'
            value={title}
            onChange={(e) => setTitle(e.target.value)} />

            <button className='btn btn-primary' onClick={handleAdd} disabled={loading}>Add</button>
        </div>

        {loading ? (
          <p className='text-center mt-4 font-semibold'>Loading...</p>
        ) : todos.length === 0 ? (
          <p className='text-center text-gray-500 p-4 mt-4 font-semibold text-lg'>No tasks yet</p>
        ) : null}

        <div className='space-y-2'>
          {todos.map((todo) => (
            <div key={todo._id} className='flex justify-between items-start bg-base-200 p-3 my-2 rounded-lg'>

              {editId === todo._id ? (
                <input type="text" className='input input-bordered w-full' value={editText} onChange={(e) => setEditText(e.target.value)} />
              ) : (<span className='flex-1 break-words'>{todo.title}</span>)}

              <div className='flex flex-row sm:flex-col gap-2 ml-2 shrink-0'>
                {editId === todo._id ? (
                  <>
                  <button className='btn btn-sm btn-success' onClick={() => handleSave(todo._id)}>Save</button>
                  <button className='btn btn-sm' onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <button className='btn btn-sm btn-warning mr-1' onClick={() => handleEdit(todo)}>
                    
                    <FontAwesomeIcon icon={faEdit}/> Edit
                    </button>
                )}
              <button className='btn btn-sm btn-error'onClick={() => handleDelete(todo._id)}>
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