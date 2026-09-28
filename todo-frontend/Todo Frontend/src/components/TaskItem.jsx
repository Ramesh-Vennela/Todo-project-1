
import { useState } from "react";

function TaskItem({ task, onDelete, onUpdate }) {

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(
        task.description || ""
    );
    const [priority, setPriority] = useState(
        task.priority || "MEDIUM"
    );
    const [dueDate, setDueDate] = useState(
        task.dueDate || ""
    );

    const formatDate = (date) => {

        if (!date) {
            return "Not available";
        }

        return new Date(date).toLocaleDateString();
    };

    const getPriorityClass = () => {

        if (task.priority === "HIGH") {
            return "priority high";
        }

        if (task.priority === "LOW") {
            return "priority low";
        }

        return "priority medium";
    };

    const getPriorityText = () => {

        if (task.priority === "HIGH") {
            return "🔴 HIGH";
        }

        if (task.priority === "LOW") {
            return "🟢 LOW";
        }

        return "🟠 MEDIUM";
    };

    const isOverdue = () => {

        if (
            !task.dueDate ||
            task.completed
        ) {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const due = new Date(task.dueDate);
        due.setHours(0, 0, 0, 0);

        return due < today;
    };

    const handleUpdate = () => {

        if (title.trim() === "") {
            return;
        }

        const updatedTask = {
            title: title.trim(),
            description: description.trim(),
            priority: priority,
            dueDate: dueDate || null,
            completed: task.completed
        };

        onUpdate(task.id, updatedTask);

        setIsEditing(false);
    };

    const handleToggleComplete = () => {

        const updatedTask = {
            title: task.title,
            description: task.description,
            priority: task.priority || "MEDIUM",
            dueDate: task.dueDate || null,
            completed: !task.completed
        };

        onUpdate(task.id, updatedTask);
    };

    const handleDelete = () => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (confirmed) {
            onDelete(task.id);
        }
    };

    return (
        <div className="todo-item">

            {isEditing ? (

                <div className="edit-section">

                    <h3>Edit Task</h3>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                    />

                    <input
                        type="text"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
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

                    <div className="edit-buttons">

                        <button
                            className="save-btn"
                            onClick={handleUpdate}
                        >
                            Save Changes
                        </button>

                        <button
                            className="cancel-btn"
                            onClick={() =>
                                setIsEditing(false)
                            }
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            ) : (

                <div>

                    <div className="task-header">

                        <div className="task-title-section">

                            <h3>
                                {task.title}
                            </h3>

                            <span className="task-id">
                                Task #{task.id}
                            </span>

                        </div>

                        <div className="task-status-section">

                            <span
                                className={getPriorityClass()}
                            >
                                {getPriorityText()}
                            </span>

                            <span
                                className={
                                    task.completed
                                        ? "status completed"
                                        : "status pending"
                                }
                            >
                                {task.completed
                                    ? "Completed"
                                    : "Pending"}
                            </span>

                        </div>

                    </div>

                    <p className="task-description">
                        {task.description ||
                            "No description provided."}
                    </p>

                    <div className="task-date">

                        <span>
                            Created:
                        </span>

                        <strong>
                            {formatDate(task.createdAt)}
                        </strong>

                    </div>

                    <div className="task-date">

                        <span>
                            Due:
                        </span>

                        <strong>
                            {formatDate(task.dueDate)}
                        </strong>

                    </div>

                    {isOverdue() && (
                        <div className="overdue-warning">
                            ⚠️ Overdue
                        </div>
                    )}

                    {task.completed && (
                        <div className="task-date">

                            <span>
                                Completed:
                            </span>

                            <strong>
                                {formatDate(
                                    task.completedAt
                                )}
                            </strong>

                        </div>
                    )}

                    <div className="task-actions">

                        <button
                            className="edit-btn"
                            onClick={() =>
                                setIsEditing(true)
                            }
                        >
                            Edit
                        </button>

                        <button
                            className="complete-btn"
                            onClick={
                                handleToggleComplete
                            }
                        >
                            {task.completed
                                ? "Mark Pending"
                                : "Mark Completed"}
                        </button>

                        <button
                            className="delete-btn"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}

export default TaskItem;

