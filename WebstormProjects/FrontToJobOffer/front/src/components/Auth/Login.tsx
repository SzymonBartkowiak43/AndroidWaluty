import { useState, FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Login&Register.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            await login(credentials);
        } catch (error) {
            setError('Nieprawidłowa nazwa użytkownika lub hasło');
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Logowanie</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Nazwa użytkownika</label>
                    <input
                        id="username"
                        className="form-input"
                        type="text"
                        placeholder="Wprowadź nazwę użytkownika"
                        value={credentials.username}
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Hasło</label>
                    <input
                        id="password"
                        className="form-input"
                        type="password"
                        placeholder="Wprowadź hasło"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        required
                    />
                </div>

                {error && <div className="form-error">{error}</div>}

                <button className="submit-button" type="submit">Zaloguj się</button>
            </form>

            <div className="auth-switch">
                Nie masz jeszcze konta?
                <Link to="/register">Zarejestruj się</Link>
            </div>
        </div>
    );
};

export default Login;