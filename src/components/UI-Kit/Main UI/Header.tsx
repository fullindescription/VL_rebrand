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
import {Movie} from "../../MovieList/Movie.ts";

registerLocale('ru', ru);

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
    handleDateChange: (date: Date | null) => void;
};

const Header: React.FC<HeaderProps> = ({
                                           title,
                                           username,
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
                                    <button
                                        onClick={() => {
                                            setCurrentView('Премьеры');
                                            setCurrentFilter('premiere');
                                            navigate('/premiere');
                                        }}
                                        className="dropdown-item"
                                    >
                                        Премьера
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            setCurrentView('События');
                                            setCurrentFilter('events');
                                            navigate('/events');
                                        }}
                                        className="dropdown-item"
                                    >
                                        События
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            setCurrentView('Фильмы');
                                            setCurrentFilter('movies');
                                            navigate('/movies');
                                        }}
                                        className="dropdown-item"
                                    >
                                        Фильмы
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

                        {/* Кнопка календаря */}
                        <div className="d-flex align-items-center">
                            <button onClick={toggleCalendar} className="btn btn-outline-light d-flex align-items-center me-3">
                                <i className="bi bi-calendar3"></i>
                            </button>
                        </div>

                        {/* Кнопка профиля */}
                        {username ? (
                            <div className="d-flex align-items-center">
                                <Link to="/profile" className="btn btn-outline-light d-flex align-items-center me-3">
                                    <i className="bi bi-person-circle"></i>
                                </Link>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-outline-light d-flex align-items-center me-3">
                                <i className="bi bi-person-circle"></i>
                            </Link>
                        )}

                        {/* Кнопка корзины */}
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
