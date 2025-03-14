import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (name: string, email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage on component mount
    const storedUser = localStorage.getItem("cineverse_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would validate credentials with your backend
      // For demo purposes, we'll accept any non-empty email/password
      if (!email || !password) {
        toast.error("Email and password are required");
        return false;
      }

      // Check if the user is already logged in
      const storedUser = localStorage.getItem("cineverse_user");
      if (storedUser) {
        const existingUser = JSON.parse(storedUser);
        if (existingUser.email === email) {
          toast.error("You are already logged in");
          return false;
        }
      }

      // Simulate successful login
      const userResponse = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: email.split("@")[0], // Use part of email as name
        email: email,
      };

      setUser(userResponse);
      localStorage.setItem("cineverse_user", JSON.stringify(userResponse));
      toast.success("Successfully logged in");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to log in. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would send this data to your backend
      // For demo purposes, we'll accept any non-empty values
      if (!name || !email || !password) {
        toast.error("All fields are required");
        return false;
      }

      // Simulate successful signup
      const userResponse = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: name,
        email: email,
      };

      setUser(userResponse);
      localStorage.setItem("cineverse_user", JSON.stringify(userResponse));
      toast.success("Account created successfully");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cineverse_user");
    localStorage.removeItem("cineverse_watchlist");
    toast.success("You have been logged out");
  };

  const updateUserProfile = async (
    name: string,
    email: string
  ): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedUser = {
        ...user,
        name,
        email,
      };

      setUser(updatedUser);
      localStorage.setItem("cineverse_user", JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error("Update profile error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUserProfile,
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
