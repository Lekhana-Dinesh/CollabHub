import { Link } from "react-router-dom";
import { Users } from "lucide-react";

export const ProjectCard = ({ project }) => {
  // Calculate progress percentage
  const progressPercent =
    project.metrics.tasksTotal > 0
      ? Math.round((project.metrics.tasksDone / project.metrics.tasksTotal) * 100)
      : 0;

  // Status badge color
  const statusColors = {
    OPEN: "bg-green-100 text-green-800",
    ACTIVE: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-gray-100 text-gray-800",
  };

  const fallbackCover = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80";
  
  // Use coverUrl if it exists and is not empty, otherwise use fallback
  const imageUrl = (project.coverUrl && project.coverUrl.trim() !== "") ? project.coverUrl : fallbackCover;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="block bg-card rounded-lg border shadow-sm hover:shadow-md transition p-4"
    >
      {/* Cover image */}
      <img
        src={imageUrl}
        alt={project.title}
        className="w-full h-40 object-cover rounded-md mb-3"
        onError={(e) => {
          // If image fails to load, use fallback
          e.target.src = fallbackCover;
        }}
      />

      {/* Title and status */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg">{project.title}</h3>
        <span className={`text-xs px-2 py-1 rounded ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>

      {/* Tech stack tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {project.techStack.slice(0, 3).map((tech) => (
          <span key={tech} className="text-xs bg-secondary px-2 py-0.5 rounded">
            {tech}
          </span>
        ))}
        {project.techStack.length > 3 && (
          <span className="text-xs text-muted-foreground">
            +{project.techStack.length - 3} more
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Footer: team size */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users size={16} />
          <span>
            {project.team.length} / {project.teamMembersRequired} members
          </span>
        </div>
      </div>
    </Link>
  );
};