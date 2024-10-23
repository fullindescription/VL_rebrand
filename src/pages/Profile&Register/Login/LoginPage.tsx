import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.scss';

type LoginPageProps = {
    setUsername: (username: string) => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ setUsername }) => {
    const [username, setLocalUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Проверка, есть ли пользователь, и если да, перенаправляем
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const token = localStorage.getItem('access');
        if (storedUsername && token) {
            // Если пользователь уже вошел, перенаправляем на главную или другую защищённую страницу
            navigate('/home');
        }
    }, [navigate]);

    // Функция для логина
    const handleLogin = async () => {
        try {
            // Шаг 1: POST-запрос для аутентификации
            const loginResponse = await fetch('/api/users/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                const token = loginData.access;

                // Сохраняем токен
                localStorage.setItem('access', token);
                localStorage.setItem('refresh', loginData.refresh);

                // Шаг 2: GET-запрос для получения данных пользователя
                const userResponse = await fetch('/api/users/me/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();

                    // Сохраняем данные пользователя в localStorage
                    localStorage.setItem('username', userData.username);
                    localStorage.setItem('email', userData.email);
                    localStorage.setItem('first_name', userData.first_name);
                    localStorage.setItem('last_name', userData.last_name);

                    // Обновляем состояние приложения с именем пользователя
                    setUsername(userData.username);

                    // Перенаправляем пользователя на страницу профиля
                    navigate('/home');
                } else {
                    setError('Ошибка получения данных пользователя');
                }
            } else {
                setError('Неверное имя пользователя или пароль');
            }
        } catch (err) {
            setError('Произошла ошибка. Попробуйте еще раз.');
        }
    };

    return (
        <div className="container login">
            <div className="row justify-content-center align-items-center vh-100">
                <div className="col-md-6 col-lg-4">
                    <div className="card p-4">
                        <h2 className="text-center mb-4">Вход</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Имя пользователя:</label>
                                <input
                                    type="text"
                                    id="username"
                                    className="form-control"
                                    value={username}
                                    onChange={(e) => setLocalUsername(e.target.value)}
                                    placeholder="Введите имя пользователя"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Пароль:</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Введите пароль"
                                />
                            </div>
                            <button type="button" className="btn btn-success w-100" onClick={handleLogin}>
                                Войти
                            </button>
                        </form>
                        {error && <p className="text-danger mt-3">{error}</p>}
                        <p className="mt-3">Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
