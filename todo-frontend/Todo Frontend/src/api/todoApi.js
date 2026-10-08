import axios from "axios";

const API_URL = "http://https://todo-backend-83m3.onrender.com/api/todos";

// GET - Get all todos
export const getTodos = () => {
    return axios.get(API_URL);
};

// POST - Create todo
export const createTodo = (todo) => {
    return axios.post(API_URL, todo);
};

// PUT - Update todo
export const updateTodo = (id, todo) => {
    return axios.put(`${API_URL}/${id}`, todo);
};

// DELETE - Delete todo
export const deleteTodo = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};