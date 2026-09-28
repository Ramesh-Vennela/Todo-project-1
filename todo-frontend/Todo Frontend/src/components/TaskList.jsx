
import TaskItem from "./TaskItem";

function TaskList({ tasks, onDelete, onUpdate }) {

    console.log("Tasks received in TaskList:", tasks);

    return (
        <div className="task-list">

            {tasks && tasks.length > 0 ? (

                tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                    />
                ))

            ) : (

                <p>No tasks found.</p>

            )}

        </div>
    );
}

export default TaskList;

