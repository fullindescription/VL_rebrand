import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/UI-Kit/Main UI/Header/Header.tsx';
import MovieCarousel from './components/MovieCarousel/MovieCarousel';
import { MovieList } from './components/MovieList/MovieList';
import Footer from './components/UI-Kit/Main UI/Footer/Footer.tsx';
import LoginPage from './pages/Profile&Register/Login/LoginPage.tsx';
import RegisterPage from './pages/Profile&Register/Register/RegisterPage.tsx';
import ProfilePage from './pages/Profile&Register/Profile/ProfilePage.tsx';
import ScrollToTop from './components/UI-Kit/Outer UI/ScrollToTop.tsx';
import CartPage from './pages/Cart/CartPage/CartPage.tsx';
import { CartProvider } from './pages/Cart/CartContext.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format, addDays, parse } from 'date-fns';
import EventList from './components/EventList/EventList.tsx';
import { Movie } from './components/MovieList/Movie.ts';
import PremiereList from './components/PremiereList/PremiereList.tsx';
import HomeList from './components/HomeList/HomeList.tsx';
import { ru } from 'date-fns/locale';

const App: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
    const initialDate = localStorage.getItem('selectedDate') || format(new Date(), 'yyyy-MM-dd');
    const initialFilter = localStorage.getItem('currentFilter') || 'home';
    const [selectedDate, setSelectedDate] = useState<string>(initialDate);
    const [currentView, setCurrentView] = useState<string>('');
    const [currentFilter, setCurrentFilter] = useState<string>(initialFilter);
    const [movieData, setMovieData] = useState<Movie[]>([]);

    // Обновляем заголовок в зависимости от выбранной даты и фильтра
    const updateViewTitle = (date: string, filter: string) => {
        const formattedDate = format(parse(date, 'yyyy-MM-dd', new Date()), 'dd MMMM yyyy', { locale: ru });

        if (filter === 'home') {
            if (date === format(new Date(), 'yyyy-MM-dd')) {
                setCurrentView('Афиша на сегодня');
            } else if (date === format(addDays(new Date(), 1), 'yyyy-MM-dd')) {
                setCurrentView('Афиша на завтра');
            } else {
                setCurrentView(`Афиша на ${formattedDate}`);
            }
        } else if (filter === 'events') {
            if (date === format(new Date(), 'yyyy-MM-dd')) {
                setCurrentView('События на сегодня');
            } else if (date === format(addDays(new Date(), 1), 'yyyy-MM-dd')) {
                setCurrentView('События на завтра');
            } else {
                setCurrentView(`События на ${formattedDate}`);
            }
        } else if (filter === 'movies') {
            if (date === format(new Date(), 'yyyy-MM-dd')) {
                setCurrentView('Фильмы на сегодня');
            } else if (date === format(addDays(new Date(), 1), 'yyyy-MM-dd')) {
                setCurrentView('Фильмы на завтра');
            } else {
                setCurrentView(`Фильмы на ${formattedDate}`);
            }
        } else if (filter === 'premiere') {
            setCurrentView('Премьера');
        } else {
            setCurrentView(`Афиша на ${formattedDate}`);
        }
    };

    // Сохраняем текущий фильтр в localStorage
    useEffect(() => {
        localStorage.setItem('currentFilter', currentFilter);
    }, [currentFilter]);

    // Сохраняем выбранную дату в localStorage
    useEffect(() => {
        localStorage.setItem('selectedDate', selectedDate);
    }, [selectedDate]);

    // Обновляем заголовок при изменении маршрута или фильтра
    useEffect(() => {
        updateViewTitle(selectedDate, currentFilter);
    }, [location.pathname, selectedDate, currentFilter]);

    // Загружаем данные о сеансах
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/sessions?date=${selectedDate}&filter=${currentFilter}`);
                const data = await response.json();
                setMovieData(data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };

        fetchData();
    }, [selectedDate, currentFilter]);

    // Сохраняем username в localStorage при изменении
    useEffect(() => {
        if (username) {
            localStorage.setItem('username', username);
        }
    }, [username]);

    const handleTodayClick = () => {
        if (currentFilter === 'premiere') return;
        const today = format(new Date(), 'yyyy-MM-dd');
        setSelectedDate(today);
    };

    const handleTomorrowClick = () => {
        if (currentFilter === 'premiere') return;
        const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
        setSelectedDate(tomorrow);
    };

    const handleDateChange = (date: Date | null) => {
        if (currentFilter === 'premiere') return;
        if (date) {
            const formattedDate = format(date, 'yyyy-MM-dd');
            setSelectedDate(formattedDate);
        }
    };

    const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
        useEffect(() => {
            if (!username) {
                navigate('/login');
            }
        }, [username, navigate]);

        return username ? element : null;
    };

    return (
        <CartProvider>
            <div className="App">
                <Header
                    title="VL.RU"
                    username={username}
                    setUsername={setUsername}
                    selectedDateString={selectedDate}
                    setSelectedDate={setSelectedDate}
                    setCurrentView={setCurrentView}
                    setCurrentFilter={setCurrentFilter}
                    setMovieData={setMovieData}
                    handleTodayClick={handleTodayClick}
                    handleTomorrowClick={handleTomorrowClick}
                    updateViewTitle={updateViewTitle}
                    currentFilter={currentFilter}
                    handleDateChange={handleDateChange}
                />
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/register" element={<><RegisterPage setUsername={setUsername} /><Footer /></>} />
                    <Route path="/login" element={<><LoginPage setUsername={setUsername} /><Footer /></>} />
                    <Route path="/profile" element={<><ProfilePage /><Footer /></>} />
                    <Route path="/cart" element={<ProtectedRoute element={<><CartPage /><Footer /></>} />} />
                    <Route path="/events" element={<>
                        <main id="events-content"><MovieCarousel /><EventList selectedDate={selectedDate}
                                                                              currentView={currentView}
                                                                              currentFilter="events" /></main>
                        <Footer /></>} />
                    <Route path="/movies" element={<>
                        <main id="movies-content"><MovieCarousel /><MovieList selectedDate={selectedDate}
                                                                              currentView={currentView}
                                                                              currentFilter="movies"
                                                                              movieData={movieData}
                        /></main>
                        <Footer /></>} />
                    <Route path="/premiere" element={<>
                        <main id="premiere-content"><MovieCarousel /><PremiereList
                            currentView={currentView}
                            currentFilter="premiere" /></main>
                        <Footer /></>} />
                    <Route path="/home" element={<>
                        <main id="main-content"><MovieCarousel /><HomeList selectedDate={selectedDate}
                                                                           currentView={currentView}
                        /></main>
                        <Footer /></>} />
                </Routes>
                <ScrollToTop />
            </div>
        </CartProvider>
    );
};

export default App;
