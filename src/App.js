import React, { useState } from 'react';
import './App.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  function handleChange(e) {
    setInputValue(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (editIndex !== null) {
      const updatedTodos = todos.map((todo, idx) => 
        idx === editIndex ? inputValue : todo
      );
      setTodos(updatedTodos);
      setEditIndex(null);
    } else {
      setTodos([...todos, inputValue]);
    }
    setInputValue('');
  }

  function handleEdit(idx) {
    setInputValue(todos[idx]);
    setEditIndex(idx);
  }

  function handleDelete(idx) {
    setTodos(todos.filter((_, i) => i !== idx));
    if (editIndex === idx) setEditIndex(null);
  }

  return (
    <div className="todo-container">
      <h1 className="title">Todo List</h1>
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={editIndex !== null ? "Edit Task" : "Add a new task"}
          className="todo-input"
        />
        <button type="submit" className="todo-btn">
          {editIndex !== null ? 'Update' : 'Add'}
        </button>
      </form>
      <ul className="todo-list">
        {todos.map((todo, idx) => (
          <li key={idx} className="todo-item">
            <span className="todo-text">{todo}</span>
            <button className="edit-btn" onClick={() => handleEdit(idx)}>
              Edit
            </button>
            <button className="delete-btn" onClick={() => handleDelete(idx)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
