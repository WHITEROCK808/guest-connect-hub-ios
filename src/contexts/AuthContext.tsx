
import React, { createContext, useContext, useEffect, useState } from "react";

// User types
type UserRole = "staff" | "admin";

interface User {
  username: string;
  role: UserRole;
  name: string;
}

// Predefined users for this example
const USERS = [
  { username: "whiterockA", password: "guest123", role: "staff" as UserRole, name: "Team A" },
  { username: "whiterockB", password: "guest123", role: "staff" as UserRole, name: "Team B" },
  { username: "whiterockC", password: "guest123", role: "staff" as UserRole, name: "Team C" },
  { username: "admin", password: "admin123", role: "admin" as UserRole, name: "Admin" }
];

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Check for saved user session
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // For demo, we'll use the predefined users
    const foundUser = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      // Create a user object without the password
      const userInfo = {
        username: foundUser.username,
        role: foundUser.role,
        name: foundUser.name
      };
      
      setUser(userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider 
      value={{ user, login, logout, isAuthenticated, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
