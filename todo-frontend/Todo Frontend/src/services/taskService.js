const API_URL = "http://localhost:8080/api/todos";

// GET - Get all tasks
export const getAllTasks = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch tasks");
    }

    return response.json();
};

// POST - Create a new task
export const createTask = async (task) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        throw new Error("Failed to create task");
    }

    return response.json();
};

// PUT - Update a task
export const updateTask = async (id, task) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        throw new Error("Failed to update task");
    }

    return response.json();
};

// DELETE - Delete a task
export const deleteTask = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete task");
    }
};