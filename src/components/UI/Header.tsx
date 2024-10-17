import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

type HeaderProps = {
    title: string;
    username: string | null;
    setUsername: (username: string | null) => void;
};

const Header: React.FC<HeaderProps> = ({ title, username, setUsername }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Очищаем данные пользователя из localStorage
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('first_name');
        localStorage.removeItem('last_name');

        // Обновляем состояние
        setUsername(null);

        // Перенаправляем пользователя на главную страницу
        navigate('/');
    };

    return (
        <header className="text-white" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', position: 'fixed', width: '100%', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center p-3">
                    <div className="d-flex align-items-center">
                        <Link to="/" className="text-white text-decoration-none me-4">
                            <h1 className="m-0">{title}</h1>
                        </Link>
                    </div>

                    {/* Основное навигационное меню */}
                    <nav className="d-none d-md-flex">
                        <ul className="nav">
                            <li className="nav-item">
                                <Link to="/" className="nav-link text-white">Сегодня</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/" className="nav-link text-white">Завтра</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/" className="nav-link text-white">Скоро</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/" className="nav-link text-white">Афиша</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/" className="nav-link text-white">Фильмы</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/" className="nav-link text-white">Календарь</Link>
                            </li>
                        </ul>
                    </nav>
                    {/* Блок с кнопками "Меню" и "Вход/Выход" */}
                    <div className="d-flex align-items-center">
                        {/* Кнопка "Меню" */}
                        <div className="dropdown me-3">
                            <button className="btn btn-outline-light dropdown-toggle" type="button"
                                    id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                Меню
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><Link className="dropdown-item" to="#">Светлая тема</Link></li>
                                <li><Link className="dropdown-item" to="#">Помощь</Link></li>
                                <li><Link className="dropdown-item" to="#">Реклама</Link></li>
                            </ul>
                        </div>

                        {/* Проверка: авторизован ли пользователь */}
                        {username ? (
                            <div className="d-flex align-items-center">
                                {/* Кнопка с иконкой профиля и ссылкой на страницу профиля */}
                                <Link to="/profile" className="btn btn-outline-light d-flex align-items-center me-3">
                                    <i className="fas fa-user me-2"></i>
                                    {username}!
                                </Link>
                                <button onClick={handleLogout} className="btn btn-outline-light">
                                    <i className="fas fa-sign-out-alt"></i> {/* Иконка выхода */}
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-outline-light">Вход</Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
