import { Check, X } from "lucide-react";

export const JoinRequestPanel = ({ requests, onAccept, onReject }) => {
  const pendingRequests = requests.filter((r) => r.status === "PENDING");

  if (pendingRequests.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No pending join requests</div>;
  }

  return (
    <div className="space-y-3">
      {pendingRequests.map((request) => (
        <div key={request.id} className="bg-card border rounded-lg p-4">
          {/* User info */}
          <div className="flex items-start gap-3 mb-3">
            <img
              src={
                request.user.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.user.name}`
              }
              alt={request.user.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <h4 className="font-medium">{request.user.name}</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {request.user.skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="text-xs bg-secondary px-2 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Message */}
          <p className="text-sm text-muted-foreground mb-3 italic">"{request.message}"</p>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onAccept(request.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition"
            >
              <Check size={16} />
              Accept
            </button>
            <button
              onClick={() => onReject(request.id)}
              className="flex items-center gap-1 px-3 py-1.5 border border-red-600 text-red-600 rounded text-sm hover:bg-red-50 transition"
            >
              <X size={16} />
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
