import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthState {
  user: User | null;
  token: string | null;
}

function loadStoredAuth(): AuthState {
  try {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      return { user: JSON.parse(storedUser) as User, token: storedToken };
    }
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
  return { user: null, token: null };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [{ user, token }, setAuth] = useState<AuthState>(loadStoredAuth);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = (userData: User, newToken: string) => {
    setAuth({ user: userData, token: newToken });
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading: false,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};