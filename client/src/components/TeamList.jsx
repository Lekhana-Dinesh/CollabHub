import { Link } from 'react-router-dom';
export const TeamList = ({ members }) => {
  return (
    <div className="space-y-3">
      {members.map((member, index) => (
        <div key={index} className="flex items-center gap-3 p-3 bg-card border rounded-lg">
          {/* Avatar */}
          
          <Link to={`/profile/${member.user.id}`}>
          <img src={member.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user.name}`} alt={member.user.name} className="w-12 h-12 rounded-full"/></Link>

          {/* Info */}
          <div className="flex-1">
            <h4 className="font-medium"><Link to={`/profile/${member.user.id}`} className="text-primary hover:underline"> {member.user.name} </Link></h4>
            <p className="text-sm text-muted-foreground">{member.role}</p>
          </div>

          {/* Skills */}
          <div className="hidden sm:flex flex-wrap gap-1 max-w-xs">
            {member.user.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="text-xs bg-secondary px-2 py-0.5 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
