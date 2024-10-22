import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type RegisterPageProps = {
    setUsername: (username: string) => void;
};

const RegisterPage: React.FC<RegisterPageProps> = ({ setUsername }) => {
    const [username, setLocalUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleRegister = async () => {
        const userData = {
            username: username,
            email,
            first_name: firstName,
            last_name: lastName,
            password,
        };

        try {
            const response = await fetch('/api/users/registration/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const data = await response.json();

                // Сохраняем все данные пользователя в localStorage
                localStorage.setItem('username', data.username);
                localStorage.setItem('email', data.email);
                localStorage.setItem('first_name', data.first_name);
                localStorage.setItem('last_name', data.last_name);

                // Обновляем состояние с username
                setUsername(data.username);

                // Перенаправляем пользователя на страницу профиля после полной записи данных
                navigate('/login');
            } else {
                const data = await response.json();
                setError(data.detail || 'Ошибка при регистрации');
            }
        } catch (err) {
            setError('Произошла ошибка. Попробуйте еще раз.');
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center align-items-center vh-100">
                <div className="col-md-6 col-lg-4">
                    <div className="card p-4">
                        <h2 className="text-center mb-4">Регистрация</h2>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Имя пользователя:</label>
                                <input
                                    type="text"
                                    id="username"
                                    className="form-control"
                                    value={username}
                                    onChange={(e) => setLocalUsername(e.target.value)}
                                    placeholder="user"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="user@example.ru"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">Имя:</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    className="form-control"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="John"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Фамилия:</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    className="form-control"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Doe"
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
                                    placeholder="example_password"
                                />
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <button type="button" className="btn btn-danger w-100" onClick={handleRegister}>
                                Зарегистрироваться
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
