import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './customDatePicker.scss';
import { parse, format } from 'date-fns';

type HeaderProps = {
    title: string;
    username: string | null;
    setUsername: (username: string | null) => void;
    selectedDateString: string; // Получаем строку даты из базы данных
    setSelectedDate: (date: string) => void; // Передаем строку даты обратно
};

const Header: React.FC<HeaderProps> = ({ title, username, setUsername, selectedDateString, setSelectedDate }) => {
    const navigate = useNavigate();
    const [showCalendar, setShowCalendar] = useState(false);

    // Преобразуем строку даты в объект Date для DatePicker
    const parsedDate = parse(selectedDateString, 'yyyy-MM-dd', new Date());
    const [selectedDate, setDate] = useState<Date>(parsedDate); // Локальное состояние даты

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('first_name');
        localStorage.removeItem('last_name');
        setUsername(null);
        navigate('/');
    };

    const toggleCalendar = () => {
        setShowCalendar((prev) => !prev);
    };

    // Обработчик изменения даты
    const handleDateChange = (date: Date | null) => {
        if (date) {
            setDate(date);

            // Преобразуем объект Date обратно в строку формата yyyy-MM-dd
            const formattedDate = format(date, 'yyyy-MM-dd');

            // Передаем форматированную дату в функцию setSelectedDate
            setSelectedDate(formattedDate);

            setShowCalendar(false); // Закрываем календарь после выбора даты
        }
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
                    <nav className="d-none d-md-flex">
                        <ul className="nav">
                            <li className="nav-item">
                                <Link to="/" className="btn btn-outline text-white">Сегодня</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/" className="btn btn-outline text-white">Завтра</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/" className="btn btn-outline text-white">Премьера</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/" className="btn btn-outline text-white">Афиша</Link>
                            </li>
                            <li className="nav-item">
                                <button onClick={toggleCalendar} className="btn text-white btn-outline">
                                    Календарь
                                </button>
                            </li>
                        </ul>
                    </nav>

                    <div className="d-flex align-items-center">
                        <div className="dropdown me-3">
                            <button className="btn btn-outline text-white dropdown-toggle" type="button"
                                    id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                Меню
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><Link className="dropdown-item" to="#">Сегодня</Link></li>
                                <li><Link className="dropdown-item" to="#">Завтра</Link></li>
                                <li><Link className="dropdown-item" to="#">Премьера</Link></li>
                                <li><Link className="dropdown-item" to="#">Афиша</Link></li>
                                <li><Link className="dropdown-item" to="#">Фильмы</Link></li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleCalendar();
                                        }}>
                                        Календарь
                                    </button>
                                </li>
                                <li>
                                    <hr className="dropdown-divider"/>
                                </li>
                                <li><Link className="dropdown-item" to="#">Помощь</Link></li>
                                <li><Link className="dropdown-item" to="#">Реклама</Link></li>
                            </ul>
                        </div>
                        {username ? (
                            <div className="d-flex align-items-center">
                                <Link to="/profile" className="btn btn-outline-light d-flex align-items-center me-3">
                                    <i className="fas fa-user me-2"></i>
                                    {username}!
                                </Link>
                                <button onClick={handleLogout} className="btn btn-outline-light">
                                    <i className="fas fa-sign-out-alt"></i>
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-outline text-white">Вход</Link>
                        )}
                    </div>
                </div>

                {showCalendar && (
                    <div className="calendar-container p-3">
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            inline
                            dropdownMode="select"
                        />
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
