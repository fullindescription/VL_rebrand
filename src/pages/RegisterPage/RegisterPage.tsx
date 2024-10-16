import React from 'react';
import './RegisterPage.scss';

const RegisterPage: React.FC = () => {
    const handleRegister = () => {
        // Реализуйте логику регистрации здесь
    };

    return (
        <div className="register-page-wrapper">
            <div className="register-page">
                <h2>Регистрация</h2>
                <form>
                    <div className="register-page__field">
                        <label>Имя пользователя:</label>
                        <input type="text" />
                    </div>
                    <div className="register-page__field">
                        <label>Пароль:</label>
                        <input type="password" />
                    </div>
                    <div className="register-page__field">
                        <label>Подтвердите пароль:</label>
                        <input type="password" />
                    </div>
                    <button type="button" onClick={handleRegister}>Зарегистрироваться</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
