import React, { createContext, useContext, useReducer, useEffect } from "react";
import { api } from "../api/client";

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case "UPDATE_USER":
      return { ...state, user: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext(undefined);

// Provider component
export const AuthProvider = ({ children }) => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const user = await api.users.getMe();
          dispatch({ type: "LOGIN", payload: user });
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    const { user, token } = await api.auth.login(email, password);
    localStorage.setItem("token", token);
    dispatch({ type: "LOGIN", payload: user });
  };

  // Signup function
  const signup = async (email, password, name) => {
    const { user, token } = await api.auth.signup(email, password, name);
    localStorage.setItem("token", token);
    dispatch({ type: "LOGIN", payload: user });
  };

  // Logout function
  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
    }
  };

  // Update user function
  const updateUser = async (updates) => {
    const updatedUser = await api.users.updateMe(updates);
    dispatch({ type: "UPDATE_USER", payload: updatedUser });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
