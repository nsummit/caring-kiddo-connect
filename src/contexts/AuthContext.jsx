
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

// Create the authentication context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulate checking for a stored token
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // Simulate fetching user data
          const mockUser = {
            id: 'usr_123',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            role: 'owner'
          };
          
          setUser(mockUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Simulate API call
      if (email === 'admin@example.com' && password === 'password') {
        const mockUser = {
          id: 'usr_123',
          name: 'Sarah Johnson',
          email: 'admin@example.com',
          role: 'owner'
        };
        
        // Store token
        localStorage.setItem('authToken', 'mock-jwt-token');
        
        // Update state
        setUser(mockUser);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear stored token
    localStorage.removeItem('authToken');
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    toast.info('You have been logged out');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
