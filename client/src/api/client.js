const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// helper: build headers with JWT
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

// Generic fetch wrapper with auth + error handling
const fetchWithAuth = async (endpoint, options = {}) => {
  const headers = {
    ...authHeaders(),
    ...(options.headers || {})
  };

  
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
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
      headers: { "Content-Type": "application/json" }
    });

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
      headers: { "Content-Type": "application/json" }
    });

    if (data && data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  },

  logout: async () => {
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
      headers: { "Content-Type": "application/json" }
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
    // formData can be FormData object OR plain object
    const body = formData instanceof FormData ? formData : JSON.stringify(formData);
    
    const options = {
      method: "POST",
      body: body,
    };

    // Only add Content-Type header for JSON, never for FormData
    if (!(formData instanceof FormData)) {
      options.headers = { "Content-Type": "application/json" };
    }

    const data = await fetchWithAuth("/api/projects", options);
    return data;
  },

  requestJoin: async (projectId, message) => {
    const data = await fetchWithAuth(`/api/projects/${projectId}/join`, {
      method: "POST",
      body: JSON.stringify({ message }),
      headers: { "Content-Type": "application/json" }
    });
    return data;
  },

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
    const data = await fetchWithAuth("/api/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
      headers: { "Content-Type": "application/json" }
    });
    return data;
  },

  update: async (id, updates) => {
    const data = await fetchWithAuth(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
      headers: { "Content-Type": "application/json" }
    });
    return data;
  },
};

let tempChat = {};
let tempUserCache = {};

const chat = {
  getMessages: async (projectId) => {
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
          headers: { "Content-Type": "application/json" }
        }
      );
      return data;
    } catch (err) {
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

const leaderboard = {
  getProjects: async () => {
    try {
      const data = await fetchWithAuth("/api/leaderboard/projects", {
        method: "GET",
      });
      return data;
    } catch (err) {
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

          const skillOverlap = p.techStack.filter((tech) =>
            (me.skills || []).some((s) =>
              s.toLowerCase().includes(tech.toLowerCase())
            )
          ).length;
          score += skillOverlap * 2;

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

export const api = {
  auth,
  users,
  projects,
  tasks,
  chat,
  leaderboard,
  match,
};