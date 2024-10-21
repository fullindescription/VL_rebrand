import React, {useState, useEffect, useRef} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import DatePicker, {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './customDatePicker.scss';
import {parse, format} from 'date-fns';
import {useCart} from '../../../pages/Cart/CartContext.tsx';
import {ru} from "date-fns/locale";

registerLocale('ru', ru);

// В файле, где определён HeaderProps (например, в Header.tsx)
type HeaderProps = {
    title: string;
    username: string | null;
    setUsername: (username: string | null) => void;
    selectedDateString: string;
    setSelectedDate: (date: string) => void;
    setCurrentView: (view: string) => void;
    setCurrentFilter: (filter: string) => void;
    setMovieData: (movies: Movie[]) => void;
    handleTodayClick: () => void;
    handleTomorrowClick: () => void;
    updateViewTitle: (date: string, filter: string) => void;
    currentFilter: string;
    handleDateChange: (date: Date | null) => void; // Добавлено это свойство
};

type Movie = {
    id: number;
    title: string;
    description: string;
    duration: number;
    category_name: string;
    age_restriction: string;
    image_url: string | null;
};

const Header: React.FC<HeaderProps> = ({
                                           title,
                                           username,
                                           setUsername,
                                           selectedDateString,
                                           setSelectedDate,
                                           setCurrentView,
                                           setCurrentFilter,
                                           handleTodayClick,
                                           handleTomorrowClick,
                                           updateViewTitle,
                                           currentFilter
                                       }) => {
    const navigate = useNavigate();
    const {cart} = useCart();
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);

    const parsedDate = parse(selectedDateString, 'yyyy-MM-dd', new Date());
    const [selectedDate, setDate] = useState<Date>(parsedDate);

    const toggleCalendar = () => {
        setShowCalendar((prev) => !prev);
    };

    const handleDateChange = (date: Date | null) => {
        if (currentFilter === 'premiere') return;
        if (date) {
            setDate(date);
            const formattedDate = format(date, 'yyyy-MM-dd');
            setSelectedDate(formattedDate);
            setShowCalendar(false);
            updateViewTitle(formattedDate, currentFilter);
        }
    };


    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('first_name');
        localStorage.removeItem('last_name');
        setUsername(null);
        navigate('/');
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
            setShowCalendar(false);
        }
    };

    useEffect(() => {
        if (showCalendar) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCalendar]);

    return (
        <header
            className="text-white"
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                position: 'fixed',
                width: '100%',
                zIndex: 1000,
                backdropFilter: 'blur(5px)',
            }}
        >
            <div className="container">
                <div className="d-flex justify-content-between align-items-center p-3">
                    <div className="d-flex align-items-center">
                        <Link
                            to="/home"
                            className="text-white text-decoration-none me-4"
                            onClick={() => {
                                setCurrentView('Афиша');
                                setCurrentFilter('home');
                            }}
                        >
                            <h1 className="m-0">{title}</h1>
                        </Link>

                    </div>
                    <nav className="d-none d-md-flex">
                        <ul className="nav">
                            <li className="nav-item">
                                <button onClick={handleTodayClick} className="btn btn-outline text-white">
                                    Сегодня
                                </button>
                            </li>
                            <li className="nav-item">
                                <button onClick={handleTomorrowClick} className="btn btn-outline text-white">
                                    Завтра
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    onClick={() => {
                                        setCurrentView('Премьеры');
                                        setCurrentFilter('premiere');
                                        navigate('/premiere');
                                    }}
                                    className="btn btn-outline text-white"
                                >
                                    Премьера
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    onClick={() => {
                                        setCurrentView('События');
                                        setCurrentFilter('events');
                                        navigate('/events');
                                    }}
                                    className="btn btn-outline text-white"
                                >
                                    События
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    onClick={() => {
                                        setCurrentView('Фильмы');
                                        setCurrentFilter('movies');
                                        navigate('/movies');
                                    }}
                                    className="btn btn-outline text-white"
                                >
                                    Фильмы
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
                        {/* Dropdown Menu */}
                        <div className="dropdown me-3">
                            <button
                                className="btn btn-outline text-white dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Меню
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>
                                    <button onClick={handleTodayClick} className="dropdown-item">
                                        Сегодня
                                    </button>
                                </li>
                                <li>
                                    <button onClick={handleTomorrowClick} className="dropdown-item">
                                        Завтра
                                    </button>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/">
                                        Премьера
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/events">
                                        События
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/movies">
                                        Фильмы
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleCalendar();
                                        }}
                                    >
                                        Календарь
                                    </button>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/profile">
                                        Профиль
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/login">
                                        Войти
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="dropdown-item">
                                        Выйти
                                    </button>
                                </li>
                                <li>
                                    <hr className="dropdown-divider"/>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="#">
                                        Помощь
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="#">
                                        Реклама
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {username ? (
                            <div className="d-flex align-items-center">
                                <Link to="/profile" className="btn btn-outline-light d-flex align-items-center me-3">
                                    <i className="bi bi-person-circle"></i>
                                </Link>
                                <button onClick={handleLogout} className="btn btn-outline-light me-3">
                                    <i className="fas fa-sign-out-alt"></i>
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-outline text-white">
                                Вход
                            </Link>
                        )}

                        {/* Session Button */}
                        <button
                            className="btn btn-outline-light d-flex align-items-center position-relative"
                            onClick={() => navigate('/cart')}
                        >
                            <i className="bi bi-cart3"></i>
                            {cart.length > 0 && (
                                <span
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                    style={{fontSize: '0.75rem'}}
                                >
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {showCalendar && (
                    <div className="calendar-container p-3" ref={calendarRef}>
                        <DatePicker selected={selectedDate} onChange={handleDateChange} inline dropdownMode="select" locale="ru" />
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
