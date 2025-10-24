import React, { createContext, useContext, useReducer } from "react";

// App state shape (for global app data like projects, tasks, etc.)
const initialState = {
  projects: [],
  currentProject: null,
  tasks: [],
  filters: {
    search: "",
    category: "",
    status: "",
    techStack: [],
  },
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_PROJECTS":
      return { ...state, projects: action.payload };
    case "SET_CURRENT_PROJECT":
      return { ...state, currentProject: action.payload };
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
        currentProject:
          state.currentProject?.id === action.payload.id
            ? action.payload
            : state.currentProject,
      };
    case "SET_TASKS":
      return { ...state, tasks: action.payload };
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "RESET_FILTERS":
      return {
        ...state,
        filters: { search: "", category: "", status: "", techStack: [] },
      };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext(undefined);

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const setProjects = (projects) => dispatch({ type: "SET_PROJECTS", payload: projects });
  const setCurrentProject = (project) =>
    dispatch({ type: "SET_CURRENT_PROJECT", payload: project });
  const updateProject = (project) =>
    dispatch({ type: "UPDATE_PROJECT", payload: project });
  const setTasks = (tasks) => dispatch({ type: "SET_TASKS", payload: tasks });
  const addTask = (task) => dispatch({ type: "ADD_TASK", payload: task });
  const updateTask = (task) => dispatch({ type: "UPDATE_TASK", payload: task });
  const setFilters = (filters) => dispatch({ type: "SET_FILTERS", payload: filters });
  const resetFilters = () => dispatch({ type: "RESET_FILTERS" });

  const value = {
    ...state,
    setProjects,
    setCurrentProject,
    updateProject,
    setTasks,
    addTask,
    updateTask,
    setFilters,
    resetFilters,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook to use app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
