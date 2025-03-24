"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import config from "../config";

type User = {
  id: string;
  name: string;
  email: string;
  role: "employee" | "admin" | "stakeholder";
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
  isLoading: false,
  error: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check for token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUserData(storedToken);
    }
  }, []);

  const fetchUserData = async (authToken: string) => {
    try {
      const payload = JSON.parse(atob(authToken.split(".")[1])); // Decode JWT payload
      const isExpired = payload.exp * 1000 < Date.now(); // Convert exp to milliseconds

      if (isExpired) {
        logout(); // Expired: Logout and redirect to "/"
        return;
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data");
      logout(); // If token is invalid, logout
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${config.backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Simulate JWT token from backend
      const authToken = data.token;

      // Store token in localStorage
      localStorage.setItem("token", authToken);
      localStorage.setItem("role", data.role);
      setToken(authToken);

       // Fetch user data if token is valid
      const userData: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      setUser(userData);

      // Fetch user data
      await fetchUserData(authToken);
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setUser(null);

    // In a real app, you might want to invalidate the token on the server
    // await fetch('/api/logout', { method: 'POST' })

    // Redirect to login page
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isLoading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
