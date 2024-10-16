import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.scss';

const LoginPage: React.FC = () => {
    const handleLogin = () => {
        // Реализуйте логику входа здесь
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-page">
                <h2>Вход</h2>
                <form>
                    <div className="login-page__field">
                        <label>Имя пользователя:</label>
                        <input type="text" />
                    </div>
                    <div className="login-page__field">
                        <label>Пароль:</label>
                        <input type="password" />
                    </div>
                    <button type="button" onClick={handleLogin}>Войти</button>
                </form>
                <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
            </div>
        </div>
    );
};

export default LoginPage;
