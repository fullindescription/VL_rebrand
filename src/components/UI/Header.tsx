import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './customDatePicker.scss';
import { parse, format, addDays } from 'date-fns';

type HeaderProps = {
    title: string;
    username: string | null;
    setUsername: (username: string | null) => void;
    selectedDateString: string; // Получаем строку даты из базы данных
    setSelectedDate: (date: string) => void; // Передаем строку даты обратно
    setCurrentView: (view: string) => void;
    setCurrentFilter: (filter: string) => void;
};

const Header: React.FC<HeaderProps> = ({ title, username, setUsername, selectedDateString, setSelectedDate, setCurrentView, setCurrentFilter  }) => {
    const navigate = useNavigate();
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null); // Ссылка на календарь

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

    const handleTodayClick = () => {
        const today = format(new Date(), 'yyyy-MM-dd');
        setSelectedDate(today);
        setCurrentView('Афиша на сегодня');
        setCurrentFilter('today');
    };

    const handleTomorrowClick = () => {
        const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
        setSelectedDate(tomorrow);
        setCurrentView('Афиша на завтра');
        setCurrentFilter('tomorrow');
    };

    const handlePremiereClick = () => {
        setSelectedDate(''); // Очищаем дату, так как для премьеры дата не нужна
        setCurrentView('Премьеры');
        setCurrentFilter('premiere');
    };

    const handleEventClick = () => {
        setSelectedDate(''); // Очищаем дату, так как для события дата не нужна
        setCurrentView('События');
        setCurrentFilter('event');
    };

    const handleMoviesClick = () => {
        setSelectedDate(''); // Очищаем дату, так как для фильмов дата не нужна
        setCurrentView('Фильмы');
        setCurrentFilter('movies');
    };


    // Обработчик закрытия календаря при клике вне
    const handleClickOutside = (event: MouseEvent) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
            setShowCalendar(false); // Закрываем календарь, если клик вне его области
        }
    };

    // Добавляем обработчик на клик вне календаря
    useEffect(() => {
        if (showCalendar) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Удаляем обработчик при размонтировании компонента
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCalendar]);

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
                                <button onClick={handleTodayClick} className="btn btn-outline text-white">Сегодня
                                </button>
                            </li>
                            <li className="nav-item">
                                <button onClick={handleTomorrowClick} className="btn btn-outline text-white">Завтра
                                </button>
                            </li>
                            <li className="nav-item">
                                <button onClick={handlePremiereClick} className="btn btn-outline text-white">Премьера
                                </button>
                            </li>
                            <li className="nav-item">
                                <button onClick={handleEventClick} className="btn btn-outline text-white">Событие
                                </button>
                            </li>
                            <li className="nav-item">
                                <button onClick={handleMoviesClick} className="btn btn-outline text-white">Фильмы
                                </button>
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
                                <li>
                                    <button onClick={handleTodayClick} className="dropdown-item">Сегодня</button>
                                </li>
                                <li>
                                    <button onClick={handleTomorrowClick} className="dropdown-item">Завтра</button>
                                </li>
                                <li><Link className="dropdown-item" to="/">Премьера</Link></li>
                                <li><Link className="dropdown-item" to="/">Событие</Link></li>
                                <li><Link className="dropdown-item" to="/">Фильмы</Link></li>
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
                    <div className="calendar-container p-3" ref={calendarRef}>
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
