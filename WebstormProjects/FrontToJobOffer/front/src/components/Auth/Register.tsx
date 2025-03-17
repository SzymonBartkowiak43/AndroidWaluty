import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Login&Register.css';

const Register = () => {
    const [userData, setUserData] = useState({ username: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (userData.password !== userData.confirmPassword) {
            setError('Hasła nie są identyczne');
            return;
        }

        try {
            await register({
                username: userData.username,
                password: userData.password
            });
        } catch (error) {
            setError('Rejestracja nie powiodła się. Spróbuj ponownie.');
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Rejestracja</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Nazwa użytkownika</label>
                    <input
                        id="username"
                        className="form-input"
                        type="text"
                        placeholder="Wybierz nazwę użytkownika"
                        value={userData.username}
                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
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
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Potwierdź hasło</label>
                    <input
                        id="confirmPassword"
                        className="form-input"
                        type="password"
                        placeholder="Wprowadź hasło ponownie"
                        value={userData.confirmPassword}
                        onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                        required
                    />
                </div>

                {error && <div className="form-error">{error}</div>}

                <button className="submit-button" type="submit">Zarejestruj się</button>
            </form>

            <div className="auth-switch">
                Masz już konto?
                <Link to="/login">Zaloguj się</Link>
            </div>
        </div>
    );
};

export default Register;