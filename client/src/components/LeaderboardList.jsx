import { Trophy } from "lucide-react";

export const LeaderboardList = ({ entries, type }) => {
  const medalColors = ["text-yellow-500", "text-gray-400", "text-orange-600"];

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <div
          key={entry.rank}
          className="flex items-center gap-3 p-3 bg-card border rounded-lg hover:shadow-md transition"
        >
          {/* Rank badge */}
          <div className="flex items-center justify-center w-8 h-8">
            {index < 3 ? (
              <Trophy className={medalColors[index]} size={20} />
            ) : (
              <span className="text-sm font-semibold text-muted-foreground">#{entry.rank}</span>
            )}
          </div>

          {/* Content */}
          {type === "contributors" && entry.user && (
            <>
              <img
                src={
                  entry.user.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.user.name}`
                }
                alt={entry.user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <h4 className="font-medium">{entry.user.name}</h4>
                <p className="text-sm text-muted-foreground">{entry.score} XP</p>
              </div>
            </>
          )}

          {type === "projects" && entry.project && (
            <>
              
                  <div className="w-10 h-10 rounded object-cover"></div>
                
              
              <div className="flex-1">
                <h4 className="font-medium">{entry.project.title}</h4>
                <p className="text-sm text-muted-foreground">Score: {entry.score}</p>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
