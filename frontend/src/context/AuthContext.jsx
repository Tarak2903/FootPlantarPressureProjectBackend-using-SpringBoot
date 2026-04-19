import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage on initial load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (userName, password, role = 'STAFF') => {
    try {
      const response = await api.post('/auth/login', { userName, password });
      const { token } = response.data;
      
      // Save token and minimal user info
      localStorage.setItem('token', token);
      
      // Since login response only gives token and time, we mock user details for context
      // Alternatively, we could fetch user profile here if the API supported it
      const userData = { userName, role };
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(token);
      setUser(userData);
      return true;
    } catch (error) {
      return false;
    }
  };

  const signup = async (userName, password, role = 'STAFF') => {
    try {
      await api.post('/auth/register', { userName, password, role });
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
