import { User as UserIcon } from "lucide-react";

export const TaskItem = ({ task, onUpdate }) => {
  return (
    <div className="bg-card border rounded-lg p-3 shadow-sm hover:shadow-md transition">
      <h4 className="font-medium text-sm mb-1">{task.title}</h4>
      {task.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Assignee */}
      {task.assignee && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <UserIcon size={14} />
          <span>{task.assignee.name}</span>
        </div>
      )}

      {/* Due date if available */}
      {task.dueDate && (
        <div className="text-xs text-muted-foreground mt-1">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};
