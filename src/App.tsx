import React, {useState, useEffect} from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import Header from './components/UI-Kit/Main UI/Header.tsx';
import MovieCarousel from './components/MovieCarousel/MovieCarousel';
import {MovieList} from './components/MovieList/MovieList';
import Footer from './components/UI-Kit/Main UI/Footer.tsx';
import LoginPage from './pages/Profile&Register/LoginPage.tsx';
import RegisterPage from './pages/Profile&Register/RegisterPage.tsx';
import ProfilePage from './pages/Profile&Register/ProfilePage.tsx';
import ScrollToTop from './components/UI-Kit/Outer UI/ScrollToTop.tsx';
import CartPage from './pages/Cart/CartPage.tsx';
import {CartProvider} from './pages/Cart/CartContext.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {format, parse, addDays} from 'date-fns';
import EventList from "./components/EventList/EventList.tsx";
import {ru} from 'date-fns/locale';
import {Movie} from "./components/MovieList/Movie.ts";
import PremiereList from "./components/PremiereList/PremiereList.tsx";
import HomeList from "./components/HomeList/HomeList.tsx";


const App: React.FC = () => {
    const location = useLocation();
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

    // Используем сохранённую дату из localStorage или "сегодня", если её нет
    const initialDate = localStorage.getItem('selectedDate') || format(new Date(), 'yyyy-MM-dd');
    const [selectedDate, setSelectedDate] = useState<string>(initialDate);
    const [currentView, setCurrentView] = useState<string>('Афиша');
    const [currentFilter, setCurrentFilter] = useState<string>('movies');
    const [movieData, setMovieData] = useState<Movie[]>([]);

    const updateViewTitle = (date: string, isHome: boolean, isEventsPage: boolean, isMoviesPage: boolean) => {
        const formattedDate = format(parse(date, 'yyyy-MM-dd', new Date()), 'dd MMMM yyyy', { locale: ru });

        if (isHome) {
            if (date === format(new Date(), 'yyyy-MM-dd')) {
                setCurrentView('Афиша на сегодня');
            } else if (date === format(addDays(new Date(), 1), 'yyyy-MM-dd')) {
                setCurrentView('Афиша на завтра');
            } else {
                setCurrentView(`Афиша на ${formattedDate}`);
            }
        } else if (isEventsPage) {
            if (date === format(new Date(), 'yyyy-MM-dd')) {
                setCurrentView('События на сегодня');
            } else if (date === format(addDays(new Date(), 1), 'yyyy-MM-dd')) {
                setCurrentView('События на завтра');
            } else {
                setCurrentView(`События на ${formattedDate}`);
            }
        } else if (isMoviesPage) {
            if (date === format(new Date(), 'yyyy-MM-dd')) {
                setCurrentView('Фильмы на сегодня');
            } else if (date === format(addDays(new Date(), 1), 'yyyy-MM-dd')) {
                setCurrentView('Фильмы на завтра');
            } else {
                setCurrentView(`Фильмы на ${formattedDate}`);
            }
        } else {
            setCurrentView(`Афиша на ${formattedDate}`);
        }
    };

    const isHome = location.pathname === '/home';
    const isEventsPage = location.pathname === '/events';
    const isMoviesPage = location.pathname === '/movies';

    useEffect(() => {
        // Сохранение выбранной даты в localStorage
        localStorage.setItem('selectedDate', selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        // Обновление заголовка при переходе на указанные страницы
        updateViewTitle(selectedDate, isHome, isEventsPage, isMoviesPage);
    }, [location.pathname, isHome, isEventsPage, isMoviesPage, selectedDate, currentFilter]);

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
                    updateViewTitle={(date) => updateViewTitle(date, isHome, isEventsPage, isMoviesPage)}
                    currentFilter={currentFilter}
                    handleDateChange={handleDateChange}
                />
                <Routes>
                    <Route path="/register" element={<><RegisterPage setUsername={setUsername}/><Footer/></>}/>
                    <Route path="/login" element={<><LoginPage setUsername={setUsername}/><Footer/></>}/>
                    <Route path="/profile" element={<><ProfilePage/><Footer/></>}/>
                    <Route path="/cart" element={<><CartPage/><Footer/></>}/>
                    <Route path="/events" element={<>
                        <main id="events-content"><MovieCarousel/><EventList selectedDate={selectedDate}
                                                                             currentView={currentView}
                                                                             currentFilter="events"/></main>
                        <Footer/></>}/>
                    <Route path="/movies" element={<>
                        <main id="movies-content"><MovieCarousel/><MovieList selectedDate={selectedDate}
                                                                             currentView={currentView}
                                                                             currentFilter="movies"
                                                                             movieData={movieData}
                        /></main>
                        <Footer/></>}/>
                    <Route path="/premiere" element={<>
                        <main id="premiere-content"><MovieCarousel/><PremiereList
                            currentView={currentView}
                            currentFilter="premiere"/></main>
                        <Footer/></>}/>
                    <Route path="/home" element={<>
                        <main id="main-content"><MovieCarousel/><HomeList selectedDate={selectedDate}
                                                                          currentView={currentView}
                                                                          currentFilter="home"/></main>
                        <Footer/></>}/>
                </Routes>
                <ScrollToTop/>
            </div>
        </CartProvider>
    );
};

export default App;
