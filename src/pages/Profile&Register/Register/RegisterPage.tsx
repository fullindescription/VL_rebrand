import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.scss'

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
    const [fieldErrors, setFieldErrors] = useState({
        username: false,
        email: false,
        firstName: false,
        lastName: false,
        password: false,
        invalidEmail: false,  // Добавили это поле
    });

    const navigate = useNavigate();

    // Регулярное выражение для проверки email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    // Валидация полей перед регистрацией
    const validateFields = () => {
        const errors = {
            username: !username,
            email: !email,
            firstName: !firstName,
            lastName: !lastName,
            password: password.length < 8,
            invalidEmail: !emailRegex.test(email),  // Проверка email на корректность
        };

        setFieldErrors(errors);

        // Если хотя бы одно поле не заполнено или неправильно, возвращаем false
        return !Object.values(errors).some((field) => field === true);
    };

    const handleRegister = async () => {
        if (!validateFields()) {
            setError('Заполните все поля корректно.');
            return;
        }

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
        <div className="container register">
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
                                    className={`form-control ${fieldErrors.username ? 'is-invalid' : ''}`}
                                    value={username}
                                    onChange={(e) => setLocalUsername(e.target.value)}
                                    placeholder="user"
                                />
                                {fieldErrors.username && <div className="invalid-feedback">Введите имя пользователя</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    className={`form-control ${fieldErrors.email || fieldErrors.invalidEmail ? 'is-invalid' : ''}`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="user@example.ru"
                                />
                                {fieldErrors.email && <div className="invalid-feedback">Введите email</div>}
                                {fieldErrors.invalidEmail && <div className="invalid-feedback">Введите корректный email</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">Имя:</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    className={`form-control ${fieldErrors.firstName ? 'is-invalid' : ''}`}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="John"
                                />
                                {fieldErrors.firstName && <div className="invalid-feedback">Введите имя</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Фамилия:</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    className={`form-control ${fieldErrors.lastName ? 'is-invalid' : ''}`}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Doe"
                                />
                                {fieldErrors.lastName && <div className="invalid-feedback">Введите фамилию</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Пароль:</label>
                                <input
                                    type="password"
                                    id="password"
                                    className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Минимум 8 символов"
                                />
                                {fieldErrors.password && <div className="invalid-feedback">Пароль должен содержать минимум 8 символов</div>}
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
