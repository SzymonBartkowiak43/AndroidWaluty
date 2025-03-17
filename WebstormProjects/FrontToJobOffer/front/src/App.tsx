import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header/Header';
import OfferList from './components/Offers/OfferList';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { ReactNode, JSX } from 'react';
import './App.css';

const PrivateRoute = ({ children }: { children: ReactNode }): JSX.Element => {
    const { token } = useAuth();
    return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Header />
            <main className="app-main">
                {children}
            </main>
        </>
    );
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={
                        <AppLayout>
                            <Login />
                        </AppLayout>
                    } />
                    <Route path="/register" element={
                        <AppLayout>
                            <Register />
                        </AppLayout>
                    } />
                    <Route
                        path="/offers"
                        element={
                            <PrivateRoute>
                                <AppLayout>
                                    <OfferList />
                                </AppLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/offers" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;