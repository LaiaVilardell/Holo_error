import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { jwtDecode } from 'jwt-decode';
import axios, { AxiosError } from 'axios'; // <-- AÑADIDO

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'psychologist';
  avatar?: string;
  assignedPsychologist?: string;
}

// Objeto de retorno para las funciones de autenticación
interface AuthResponse {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'patient' | 'psychologist';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await api.get('/users/me');
          setUser(response.data);
        } catch (error) {
          console.error("Token inválido, cerrando sesión", error);
          localStorage.removeItem('access_token');
        }
      }
      setIsLoading(false);
    };
    validateToken();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const response = await api.post('/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token, user } = response.data;

      if (access_token && user) {
        localStorage.setItem('access_token', access_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        setUser(user);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, message: "Invalid response from server" };

    } catch (error) {
      console.error('Error de login:', error);
      setIsLoading(false);
      const err = error as AxiosError<{ detail: string }>;
      return { success: false, message: err.response?.data?.detail || "An unknown login error occurred" };
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      await api.post('/auth/register', userData);
      // Si el registro es exitoso, intenta hacer login
      const loginResult = await login(userData.email, userData.password);
      setIsLoading(false);
      return loginResult;
    } catch (error) {
      console.error('Error de registro:', error);
      setIsLoading(false);
      // Extrae el mensaje de error específico del backend
      const err = error as AxiosError<{ detail: string }>;
      return { success: false, message: err.response?.data?.detail || "An unknown registration error occurred" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};