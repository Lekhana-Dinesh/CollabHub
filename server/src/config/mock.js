// Mock data to simulate backend responses
// Mock users
export const mockUsers = [
  {
    id: '1',
    name: 'Alex Chen',
    email: 'alex@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    location: 'San Francisco, CA',
    skills: ['React', 'Node.js', 'Python', 'UI/UX'],
    links: {
      github: 'https://github.com/alexchen',
      linkedin: 'https://linkedin.com/in/alexchen',
    },
    xp: 450,
    badges: ['Early Adopter', 'Team Player'],
    preferences: {
      categories: ['Web Development', 'Mobile Apps'],
      roles: ['Frontend Developer', 'Designer'],
    },
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Jordan Smith',
    email: 'jordan@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    location: 'Austin, TX',
    skills: ['JavaScript', 'Express', 'MongoDB', 'GraphQL'],
    links: {
      github: 'https://github.com/jordansmith',
    },
    xp: 320,
    badges: ['Fast Learner'],
    preferences: {
      categories: ['Backend', 'APIs'],
      roles: ['Backend Developer', 'DevOps'],
    },
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: '3',
    name: 'Sam Lee',
    email: 'sam@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
    location: 'Seattle, WA',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    links: {
      portfolio: 'https://samlee.dev',
    },
    xp: 280,
    badges: [],
    preferences: {
      categories: ['Backend', 'DevOps'],
      roles: ['Backend Developer', 'Database Admin'],
    },
    createdAt: '2024-02-10T10:00:00Z',
  },
];

// Mock projects
export const mockProjects = [
  {
    id: '1',
    owner: mockUsers[0],
    title: 'EcoTrack - Sustainability App',
    description: 'A mobile app to help users track their carbon footprint and get eco-friendly tips.',
    coverUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    tags: ['sustainability', 'mobile', 'social-impact'],
    techStack: ['React Native', 'Node.js', 'MongoDB'],
    status: 'OPEN',
    team: [
      { user: mockUsers[0], role: 'Project Lead', joinedAt: '2024-03-01T10:00:00Z' },
    ],
    rolesNeeded: [
      { role: 'Backend Developer', count: 1 },
      { role: 'Mobile Developer', count: 1 },
      { role: 'UI/UX Designer', count: 1 },
    ],
    joinRequests: [
      {
        id: 'req1',
        user: mockUsers[1],
        message: 'I have 2 years of Node.js experience and would love to help with the backend!',
        createdAt: '2024-03-05T14:30:00Z',
        status: 'PENDING',
      },
    ],
    teamMembersRequired: 5,
    skillsRequired: ['React Native', 'Node.js', 'MongoDB', 'UI/UX'],
    needsTeamMembers: true,
    needsContributors: false,
    metrics: { tasksTotal: 8, tasksDone: 2 },
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: '2',
    owner: mockUsers[1],
    title: 'StudyBuddy - Collaborative Learning',
    description: 'Platform for students to find study partners and share resources.',
    coverUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    tags: ['education', 'web', 'collaboration'],
    techStack: ['React', 'Express', 'PostgreSQL', 'Socket.io'],
    status: 'ACTIVE',
    team: [
      { user: mockUsers[1], role: 'Full Stack Dev', joinedAt: '2024-02-15T10:00:00Z' },
      { user: mockUsers[2], role: 'Backend Dev', joinedAt: '2024-02-20T10:00:00Z' },
    ],
    rolesNeeded: [
      { role: 'Frontend Developer', count: 1 },
    ],
    joinRequests: [],
    teamMembersRequired: 3,
    skillsRequired: ['React', 'Express', 'PostgreSQL', 'Socket.io'],
    needsTeamMembers: true,
    needsContributors: false,
    metrics: { tasksTotal: 15, tasksDone: 10 },
    createdAt: '2024-02-15T10:00:00Z',
  },
  {
    id: '3',
    owner: mockUsers[2],
    title: 'CodeSnippet Manager',
    description: 'Chrome extension to save and organize code snippets with tagging.',
    coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    tags: ['developer-tools', 'browser-extension'],
    techStack: ['JavaScript', 'Chrome APIs', 'IndexedDB'],
    status: 'COMPLETED',
    team: [
      { user: mockUsers[2], role: 'Solo Developer', joinedAt: '2024-01-10T10:00:00Z' },
    ],
    rolesNeeded: [],
    joinRequests: [],
    teamMembersRequired: 1,
    skillsRequired: ['JavaScript', 'Chrome APIs', 'IndexedDB'],
    needsTeamMembers: false,
    needsContributors: false,
    metrics: { tasksTotal: 12, tasksDone: 12 },
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '4',
    owner: mockUsers[0],
    title: 'FitFam - Workout Tracker',
    description: 'Social fitness app where friends can share workouts and compete on leaderboards.',
    coverUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    tags: ['fitness', 'social', 'mobile'],
    techStack: ['React Native', 'Firebase', 'Redux'],
    status: 'OPEN',
    team: [
      { user: mockUsers[0], role: 'Product Lead', joinedAt: '2024-03-10T10:00:00Z' },
    ],
    rolesNeeded: [
      { role: 'Mobile Developer', count: 2 },
      { role: 'Designer', count: 1 },
    ],
    joinRequests: [],
    teamMembersRequired: 4,
    skillsRequired: ['React Native', 'Firebase', 'Redux'],
    needsTeamMembers: true,
    needsContributors: true,
    contributionRequirements: 'Looking for fitness experts to help with workout plans and nutrition guides',
    metrics: { tasksTotal: 10, tasksDone: 1 },
    createdAt: '2024-03-10T10:00:00Z',
  },
];

// Mock tasks
export const mockTasks = [
  {
    id: 't1',
    projectId: '1',
    title: 'Design landing page mockups',
    description: 'Create initial wireframes and high-fidelity mockups',
    status: 'DONE',
    assignee: mockUsers[0],
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-03T10:00:00Z',
  },
  {
    id: 't2',
    projectId: '1',
    title: 'Set up backend API structure',
    description: 'Initialize Express server and define REST endpoints',
    status: 'DONE',
    assignee: mockUsers[0],
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-04T10:00:00Z',
  },
  {
    id: 't3',
    projectId: '1',
    title: 'Implement carbon calculator logic',
    description: 'Create algorithm to calculate carbon footprint based on user activities',
    status: 'IN_PROGRESS',
    createdAt: '2024-03-02T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z',
  },
  {
    id: 't4',
    projectId: '1',
    title: 'Build user profile screen',
    description: 'React Native screen showing user stats and badges',
    status: 'TODO',
    createdAt: '2024-03-02T10:00:00Z',
    updatedAt: '2024-03-02T10:00:00Z',
  },
  {
    id: 't5',
    projectId: '2',
    title: 'Create study room feature',
    description: 'Real-time collaborative space with video chat',
    status: 'IN_PROGRESS',
    assignee: mockUsers[1],
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
];

// Mock chat messages (per project)
export const mockChatMessages = [
  {
    id: 'c1',
    projectId: '1',
    user: mockUsers[0],
    text: 'Hey team! Just created the project. Excited to get started!',
    createdAt: '2024-03-01T11:00:00Z',
  },
  {
    id: 'c2',
    projectId: '1',
    user: mockUsers[0],
    text: 'I finished the landing page mockups. Check the Tasks tab.',
    createdAt: '2024-03-03T15:30:00Z',
  },
];

// Current logged-in user (for demo purposes)
export let currentUser = null;

// Mock API functions
export const mockApi = {
  // Auth
  login: async (email, password) => {
    // simulate delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers.find((u) => u.email === email);
    if (user) {
      currentUser = user;
      return { user, token: 'mock-jwt-token' };
    }
    throw new Error('Invalid credentials');
  },

  signup: async (email, password, name) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser = {
      id: String(mockUsers.length + 1),
      name,
      email,
      skills: [],
      links: {},
      xp: 0,
      badges: [],
      preferences: { categories: [], roles: [] },
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    currentUser = newUser;
    return { user: newUser, token: 'mock-jwt-token' };
  },

  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    currentUser = null;
  },

  // Users
  getMe: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (!currentUser) throw new Error('Not authenticated');
    return currentUser;
  },

  updateMe: async (updates) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (!currentUser) throw new Error('Not authenticated');
    currentUser = { ...currentUser, ...updates };
    return currentUser;
  },

  getUserById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const user = mockUsers.find((u) => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  },

  // Projects
  getProjects: async (filters) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    // TODO: apply filters
    return mockProjects;
  },

  getProjectById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const project = mockProjects.find((p) => p.id === id);
    if (!project) throw new Error('Project not found');
    return project;
  },

  createProject: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!currentUser) throw new Error('Not authenticated');

    const newProject = {
      id: String(mockProjects.length + 1),
      owner: currentUser,
      title: data.title,
      description: data.description,
      coverUrl: data.coverUrl,
      tags: data.tags || [],
      techStack: data.techStack || [],
      status: 'OPEN',
      team: [{ user: currentUser, role: 'Owner', joinedAt: new Date().toISOString() }],
      rolesNeeded: data.rolesNeeded || [],
      joinRequests: [],
      teamMembersRequired: data.teamMembersRequired || 1,
      skillsRequired: data.skillsRequired || [],
      needsTeamMembers: data.needsTeamMembers ?? true,
      needsContributors: data.needsContributors ?? false,
      contributionRequirements: data.contributionRequirements,
      metrics: { tasksTotal: 0, tasksDone: 0 },
      createdAt: new Date().toISOString(),
    };

    mockProjects.push(newProject);
    return newProject;
  },

  likeProject: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // No-op in mock (you used to treat this as bookmark/favorite)
    const project = mockProjects.find((p) => p.id === id);
    if (project) return project;
    throw new Error('Project not found');
  },

  requestJoinProject: async (projectId, message) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (!currentUser) throw new Error('Not authenticated');

    const project = mockProjects.find((p) => p.id === projectId);
    if (!project) throw new Error('Project not found');

    const request = {
      id: 'req' + Date.now(),
      user: currentUser,
      message,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    };

    project.joinRequests.push(request);
    return request;
  },

  acceptJoinRequest: async (projectId, requestId) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const project = mockProjects.find((p) => p.id === projectId);
    if (!project) throw new Error('Project not found');

    const request = project.joinRequests.find((r) => r.id === requestId);
    if (!request) throw new Error('Request not found');

    request.status = 'ACCEPTED';
    project.team.push({
      user: request.user,
      role: 'Member',
      joinedAt: new Date().toISOString(),
    });

    return project;
  },

  rejectJoinRequest: async (projectId, requestId) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const project = mockProjects.find((p) => p.id === projectId);
    if (!project) throw new Error('Project not found');

    const request = project.joinRequests.find((r) => r.id === requestId);
    if (!request) throw new Error('Request not found');

    request.status = 'REJECTED';
    return project;
  },

  // Tasks
  getTasksByProject: async (projectId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockTasks.filter((t) => t.projectId === projectId);
  },

  createTask: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newTask = {
      id: 't' + Date.now(),
      projectId: data.projectId,
      title: data.title,
      description: data.description || '',
      status: 'TODO',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockTasks.push(newTask);

    // update project metrics
    const project = mockProjects.find((p) => p.id === data.projectId);
    if (project) {
      project.metrics.tasksTotal += 1;
    }

    return newTask;
  },

  updateTask: async (id, updates) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const task = mockTasks.find((t) => t.id === id);
    if (!task) throw new Error('Task not found');

    const oldStatus = task.status;
    Object.assign(task, updates, { updatedAt: new Date().toISOString() });

    // if marked done, increment metrics
    if (oldStatus !== 'DONE' && updates.status === 'DONE') {
      const project = mockProjects.find((p) => p.id === task.projectId);
      if (project) {
        project.metrics.tasksDone += 1;
      }
    }

    return task;
  },

  // Chat
  getChatMessages: async (projectId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockChatMessages.filter((m) => m.projectId === projectId);
  },

  sendChatMessage: async (projectId, text) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (!currentUser) throw new Error('Not authenticated');

    const message = {
      id: 'c' + Date.now(),
      projectId,
      user: currentUser,
      text,
      createdAt: new Date().toISOString(),
    };

    mockChatMessages.push(message);
    return message;
  },

  // Leaderboard
  getTopProjects: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const sorted = [...mockProjects].sort(
      (a, b) => b.metrics.tasksDone - a.metrics.tasksDone
    );
    return sorted.slice(0, 10).map((p, idx) => ({
      project: p,
      score: p.metrics.tasksDone,
      rank: idx + 1,
    }));
  },

  getTopContributors: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const sorted = [...mockUsers]
      .map((u) => ({
        user: u,
        score: u.xp,
        rank: 0,
      }))
      .sort((a, b) => b.score - a.score);

    sorted.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return sorted.slice(0, 10);
  },

  // Matching
  getSuggestedProjects: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!currentUser) return [];

    // very simple "match score"
    const scored = mockProjects
      .filter((p) => p.status === 'OPEN' && p.owner.id !== currentUser.id)
      .map((p) => {
        let score = 0;

        // skill overlap
        const skillOverlap = p.techStack.filter((tech) =>
          currentUser.skills?.some((skill) =>
            skill.toLowerCase().includes(tech.toLowerCase())
          )
        ).length;
        score += skillOverlap * 2;

        // category match
        const categoryOverlap = p.tags.filter((tag) =>
          currentUser.preferences?.categories?.some((cat) =>
            tag.toLowerCase().includes(cat.toLowerCase())
          )
        ).length;
        score += categoryOverlap;

        // bonus if OPEN
        if (p.status === 'OPEN') score += 1;

        return { project: p, score };
      })
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, 10).map((s) => s.project);
  },
};
