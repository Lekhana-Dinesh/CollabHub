import { Github, Linkedin, Globe, Award } from "lucide-react";

export const ProfileCard = ({ user }) => {
  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      {/* Avatar and basic info */}
      <div className="flex items-start gap-4">
        <img
          src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
          alt={user.name}
          className="w-20 h-20 rounded-full"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          {user.location && <p className="text-sm text-muted-foreground">{user.location}</p>}
          <div className="flex items-center gap-2 mt-2">
            <Award size={16} className="text-yellow-500" />
            <span className="text-sm font-medium">{user.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      {Array.isArray(user.skills) && user.skills.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span key={skill} className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      {Array.isArray(user.badges) && user.badges.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {user.badges.map((badge) => (
              <span key={badge} className="text-xs bg-secondary px-2 py-1 rounded flex items-center gap-1">
                <Award size={12} />
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Links</h3>
        <div className="flex gap-3">
          {user.links?.github && (
            <a
              href={user.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
            >
              <Github size={16} />
              GitHub
            </a>
          )}
          {user.links?.linkedin && (
            <a
              href={user.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
            >
              <Linkedin size={16} />
              LinkedIn
            </a>
          )}
          {user.links?.portfolio && (
            <a
              href={user.links.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
            >
              <Globe size={16} />
              Portfolio
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
