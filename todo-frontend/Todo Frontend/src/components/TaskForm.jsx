
import { useState } from "react";

function TaskForm({ onTaskAdded, onSearch }) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [dueDate, setDueDate] = useState("");
    const [searchText, setSearchText] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {

        e.preventDefault();

        if (title.trim() === "") {
            setError("Please enter a task title.");
            return;
        }

        setError("");

        const task = {
            title: title.trim(),
            description: description.trim(),
            priority: priority,
            dueDate: dueDate || null,
            completed: false
        };

        onTaskAdded(task);

        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        setDueDate("");
    };

    const handleSearch = () => {
        onSearch(searchText);
    };

    return (
        <div className="task-form-section">

            <h2>Add a New Task</h2>

            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}

            <form
                className="todo-input"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setError("");
                    }}
                />

                <input
                    type="text"
                    placeholder="Enter task description"
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                    }}
                />

                <select
                    value={priority}
                    onChange={(e) =>
                        setPriority(e.target.value)
                    }
                >
                    <option value="HIGH">
                        🔴 High
                    </option>

                    <option value="MEDIUM">
                        🟠 Medium
                    </option>

                    <option value="LOW">
                        🟢 Low
                    </option>
                </select>

                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) =>
                        setDueDate(e.target.value)
                    }
                />

                <button type="submit">
                    + Add Task
                </button>

            </form>

            <div className="search-section">

                <input
                    type="text"
                    className="search-input"
                    placeholder="Search task"
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                    }}
                />

                <button
                    type="button"
                    className="search-button"
                    onClick={handleSearch}
                >
                    Search
                </button>

            </div>

        </div>
    );
}

export default TaskForm;

