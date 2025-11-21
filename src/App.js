import React, { useState, useEffect } from 'react';
import './App.css';

// Local storage utilities
const getUsers = () => {
  const users = localStorage.getItem('todoUsers');
  return users ? JSON.parse(users) : [];
};

const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('todoUsers', JSON.stringify(users));
};

const findUser = (email, password) => {
  const users = getUsers();
  return users.find(user => user.email === email && user.password === password);
};

const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

const logout = () => {
  localStorage.removeItem('currentUser');
};

const getUserTodos = (userId) => {
  const todos = localStorage.getItem(`todos_${userId}`);
  return todos ? JSON.parse(todos) : [];
};

const saveTodos = (userId, todos) => {
  localStorage.setItem(`todos_${userId}`, JSON.stringify(todos));
};

// Login Component
function Login({ onLogin, switchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = findUser(email, password);
    if (user) {
      setCurrentUser(user);
      onLogin(user);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>
        Don't have an account?{' '}
        <button onClick={switchToSignup} className="link-btn">Sign up</button>
      </p>
    </div>
  );
}

// Signup Component
function Signup({ onSignup, switchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = getUsers();
    if (users.find(user => user.email === email)) {
      setError('Email already exists');
      return;
    }
    const newUser = { id: Date.now(), name, email, password };
    saveUser(newUser);
    setCurrentUser(newUser);
    onSignup(newUser);
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>
        Already have an account?{' '}
        <button onClick={switchToLogin} className="link-btn">Login</button>
      </p>
    </div>
  );
}

// Dashboard Component
function Dashboard({ user, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const userTodos = getUserTodos(user.id);
    setTodos(userTodos);
  }, [user.id]);

  useEffect(() => {
    saveTodos(user.id, todos);
  }, [todos, user.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (editIndex !== null) {
      const updatedTodos = todos.map((todo, idx) => 
        idx === editIndex ? { ...todo, text: inputValue } : todo
      );
      setTodos(updatedTodos);
      setEditIndex(null);
    } else {
      setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }]);
    }
    setInputValue('');
  };

  const handleEdit = (idx) => {
    setInputValue(todos[idx].text);
    setEditIndex(idx);
  };

  const handleDelete = (idx) => {
    setTodos(todos.filter((_, i) => i !== idx));
    if (editIndex === idx) setEditIndex(null);
  };

  const toggleComplete = (idx) => {
    const updatedTodos = todos.map((todo, i) => 
      i === idx ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Welcome, {user.name}!</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
      <div className="todo-container">
        <h2>Your Todo List</h2>
        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={editIndex !== null ? "Edit Task" : "Add a new task"}
            className="todo-input"
          />
          <button type="submit" className="todo-btn">
            {editIndex !== null ? 'Update' : 'Add'}
          </button>
        </form>
        <ul className="todo-list">
          {todos.map((todo, idx) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(idx)}
              />
              <span className="todo-text">{todo.text}</span>
              <button className="edit-btn" onClick={() => handleEdit(idx)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(idx)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
        {todos.length === 0 && <p className="empty-state">No todos yet. Add one above!</p>}
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [currentUser, setCurrentUserState] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUserState(user);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUserState(user);
  };

  const handleSignup = (user) => {
    setCurrentUserState(user);
  };

  const handleLogout = () => {
    logout();
    setCurrentUserState(null);
  };

  if (currentUser) {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  return (
    <div className="app">
      {isLogin ? (
        <Login 
          onLogin={handleLogin} 
          switchToSignup={() => setIsLogin(false)} 
        />
      ) : (
        <Signup 
          onSignup={handleSignup} 
          switchToLogin={() => setIsLogin(true)} 
        />
      )}
    </div>
  );
}

export default App;
