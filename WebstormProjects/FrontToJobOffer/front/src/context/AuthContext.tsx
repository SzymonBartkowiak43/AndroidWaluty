// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

type AuthContextType = {
    token: string | null;
    login: (credentials: { username: string; password: string }) => Promise<void>;
    register: (userData: { username: string; password: string }) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const navigate = useNavigate();

    const login = async (credentials: { username: string; password: string }) => {
        try {
            const response = await api.post('/token', credentials);
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            navigate('/offers');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (userData: { username: string; password: string }) => {
        try {
            await api.post('/register', userData);
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);