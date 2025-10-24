

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// helper: build headers with JWT
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
};

// Generic fetch wrapper with auth + error handling
const fetchWithAuth = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {})
    },
    credentials: "include", // just in case you later move auth to cookies
  });

  // handle 204 No Content
  if (res.status === 204) return null;

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = (data && data.message) || "Request failed";
    throw new Error(message);
  }

  return data;
};



const auth = {
  signup: async (email, password, name) => {
    const body = { name, email, password };

    const data = await fetchWithAuth("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    });

    // expecting { user, token }
    if (data && data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  },

  login: async (email, password) => {
    const body = { email, password };

    const data = await fetchWithAuth("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    // expecting { user, token }
    if (data && data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  },

  logout: async () => {
    // optional endpoint on backend; if you didn't build it,
    // just clear local token.
    try {
      await fetchWithAuth("/api/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      // even if server has no /logout, we still clear locally
    }

    localStorage.removeItem("token");
    return true;
  },
};


const users = {
  getMe: async () => {
    const data = await fetchWithAuth("/api/users/me", {
      method: "GET",
    });
    return data;
  },

  updateMe: async (updates) => {
    const data = await fetchWithAuth("/api/users/me", {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    return data;
  },

  getById: async (id) => {
    const data = await fetchWithAuth(`/api/users/${id}`, {
      method: "GET",
    });
    return data;
  },
};



const projects = {
  list: async (filters) => {
    // We can send filters later as query params to backend if you add that.
    // For now just GET all.
    const data = await fetchWithAuth("/api/projects", {
      method: "GET",
    });
    return data;
  },

  getById: async (id) => {
    const data = await fetchWithAuth(`/api/projects/${id}`, {
      method: "GET",
    });
    return data;
  },

  create: async (formData) => {
   
    const data = await fetchWithAuth("/api/projects", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    return data;
  },

  // ask to join / contribute
  requestJoin: async (projectId, message) => {

    const data = await fetchWithAuth(`/api/projects/${projectId}/join`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
    return data;
  },

  // accept join request (leader only)
  acceptRequest: async (projectId, requestId) => {
    const data = await fetchWithAuth(
      `/api/projects/${projectId}/requests/${requestId}/accept`,
      {
        method: "POST",
      }
    );
    return data;
  },

  rejectRequest: async (projectId, requestId) => {
    const data = await fetchWithAuth(
      `/api/projects/${projectId}/requests/${requestId}/reject`,
      {
        method: "POST",
      }
    );
    return data;
  },
};



const tasks = {
  getByProject: async (projectId) => {
    const data = await fetchWithAuth(
      `/api/projects/${projectId}/tasks`,
      { method: "GET" }
    );
    return data;
  },

  create: async (taskData) => {
    // taskData from KanbanBoard:
    // { projectId, title, description }
  
  
    const data = await fetchWithAuth("/api/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    });
    return data;
  },

  update: async (id, updates) => {
    // updates can be { status: "IN_PROGRESS" } etc.
    const data = await fetchWithAuth(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    return data;
  },
};


let tempChat = {}; // { [projectId]: [ {id,user,text,createdAt}, ... ] }
let tempUserCache = {}; // we'll fill current user when login() happens

const chat = {
  getMessages: async (projectId) => {
    // try backend route FIRST if you ever add it:
    // GET /api/projects/:projectId/chat
    // if 404, fallback
    try {
      const data = await fetchWithAuth(
        `/api/projects/${projectId}/chat`,
        { method: "GET" }
      );
      return data;
    } catch (err) {

      return tempChat[projectId] || [];
    }
  },

  sendMessage: async (projectId, text) => {

    try {
      const data = await fetchWithAuth(
        `/api/projects/${projectId}/chat`,
        {
          method: "POST",
          body: JSON.stringify({ text }),
        }
      );
      return data;
    } catch (err) {
      // fallback
      const me = tempUserCache.me || null;
      const message = {
        id: "c" + Date.now(),
        projectId,
        user: me || { name: "You", avatarUrl: "" },
        text,
        createdAt: new Date().toISOString(),
      };
      if (!tempChat[projectId]) tempChat[projectId] = [];
      tempChat[projectId].push(message);
      return message;
    }
  },
};

// leaderboard fallback
const leaderboard = {
  getProjects: async () => {
    try {
      const data = await fetchWithAuth("/api/leaderboard/projects", {
        method: "GET",
      });
      return data;
    } catch (err) {
      // fallback: we’ll just call /api/projects and rank by tasksDone
      const projectsData = await projects.list();
      const sorted = [...projectsData].sort(
        (a, b) => b.metrics.tasksDone - a.metrics.tasksDone
      );
      return sorted.slice(0, 10).map((p, idx) => ({
        project: p,
        score: p.metrics.tasksDone,
        rank: idx + 1,
      }));
    }
  },

  getContributors: async () => {
    try {
      const data = await fetchWithAuth("/api/leaderboard/contributors", {
        method: "GET",
      });
      return data;
    } catch (err) {
      
      // We'll try to fetch from /api/users/me and /api/users/:id from projects.
      const projList = await projects.list();
      const seen = {};
      projList.forEach((proj) => {
        proj.team.forEach((member) => {
          const u = member.user;
          if (!seen[u.id]) {
            seen[u.id] = {
              user: u,
              score: u.xp || 0,
              rank: 0,
            };
          }
        });
      });
      const arr = Object.values(seen).sort((a, b) => b.score - a.score);
      arr.forEach((entry, i) => (entry.rank = i + 1));
      return arr.slice(0, 10);
    }
  },
};

// match fallback
const match = {
  getSuggested: async () => {
    try {
      const data = await fetchWithAuth("/api/match/suggested", {
        method: "GET",
      });
      return data;
    } catch (err) {
      
      let me;
      try {
        me = await users.getMe();
        tempUserCache.me = me;
      } catch {
        me = null;
      }

      const all = await projects.list();
      if (!me) return [];

      const scored = all
        .filter((p) => p.status === "OPEN" && p.owner.id !== me.id)
        .map((p) => {
          let score = 0;

          // skill overlap
          const skillOverlap = p.techStack.filter((tech) =>
            (me.skills || []).some((s) =>
              s.toLowerCase().includes(tech.toLowerCase())
            )
          ).length;
          score += skillOverlap * 2;

          // tags vs preferences
          const categoryOverlap = p.tags.filter((tag) =>
            (me.preferences?.categories || []).some((c) =>
              tag.toLowerCase().includes(c.toLowerCase())
            )
          ).length;
          score += categoryOverlap;

          if (p.status === "OPEN") score += 1;

          return { project: p, score };
        })
        .sort((a, b) => b.score - a.score);

      return scored.slice(0, 10).map((s) => s.project);
    }
  },
};

// export the full api surface
export const api = {
  auth,
  users,
  projects,
  tasks,
  chat,
  leaderboard,
  match,
};
