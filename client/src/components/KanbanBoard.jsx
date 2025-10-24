import { useState } from "react";
import { Plus } from "lucide-react";
import { TaskItem } from "./TaskItem";

// Kanban board with drag-and-drop (client-side only)
export const KanbanBoard = ({ tasks, onUpdateTask, onCreateTask }) => {
  const [showNewTask, setShowNewTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  const columns = [
    { id: "TODO", title: "To Do", tasks: tasks.filter((t) => t.status === "TODO") },
    { id: "IN_PROGRESS", title: "In Progress", tasks: tasks.filter((t) => t.status === "IN_PROGRESS") },
    { id: "DONE", title: "Done", tasks: tasks.filter((t) => t.status === "DONE") },
  ];

  const handleDragStart = (e, task) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) onUpdateTask(taskId, { status });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleCreateTask = (columnId) => {
    if (!newTaskTitle.trim()) return;
    onCreateTask(newTaskTitle, newTaskDesc);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setShowNewTask(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className="bg-secondary/20 rounded-lg p-4"
          onDrop={(e) => handleDrop(e, column.id)}
          onDragOver={handleDragOver}
        >
          {/* Column header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              {column.title} ({column.tasks.length})
            </h3>
            <button
              onClick={() => setShowNewTask(column.id)}
              className="p-1 hover:bg-background rounded transition"
              title="Add task"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Task list */}
          <div className="space-y-2">
            {column.tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                className="cursor-move"
              >
                <TaskItem task={task} onUpdate={onUpdateTask} />
              </div>
            ))}
          </div>

          {/* New task form */}
          {showNewTask === column.id && (
            <div className="mt-2 bg-card border rounded-lg p-3 space-y-2">
              <input
                type="text"
                placeholder="Task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                autoFocus
              />
              <textarea
                placeholder="Description (optional)"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm resize-none"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleCreateTask(column.id)}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowNewTask(null);
                    setNewTaskTitle("");
                    setNewTaskDesc("");
                  }}
                  className="px-3 py-1 border rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
