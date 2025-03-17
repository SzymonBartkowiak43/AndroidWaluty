import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="logo" onClick={() => navigate('/')}>
                    <span className="logo-text">JobFinder</span>
                </div>

                <nav className="nav-menu">
                    <ul>
                        <li>
                            <button
                                className="nav-link"
                                onClick={() => navigate('/offers')}
                            >
                                Oferty Pracy
                            </button>
                        </li>

                        {token ? (
                            <li>
                                <button
                                    className="nav-link logout-btn"
                                    onClick={handleLogout}
                                >
                                    Wyloguj się
                                </button>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <button
                                        className="nav-link"
                                        onClick={() => navigate('/login')}
                                    >
                                        Logowanie
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="nav-link register-btn"
                                        onClick={() => navigate('/register')}
                                    >
                                        Rejestracja
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;