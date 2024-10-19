import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/UI/Header';
import MovieCarousel from './components/MovieCarousel/MovieCarousel';
import { MovieList } from './components/MovieList/MovieList';
import Footer from './components/UI/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ScrollToTop from './components/UI/ScrollToTop';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';

const App: React.FC = () => {
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd')); // Начальная дата — текущая
    const [currentView, setCurrentView] = useState<string>('Афиша'); // Начальное значение заголовка
    const [currentFilter, setCurrentFilter] = useState<string>('');

    useEffect(() => {
        if (username) {
            localStorage.setItem('username', username);
        } else {
            localStorage.removeItem('username');
        }
    }, [username]);

    return (
        <div className="App">
            <Header
                title="VL.RU"
                username={username}
                setUsername={setUsername}
                selectedDateString={selectedDate} // Передаем строку текущей даты в Header
                setSelectedDate={setSelectedDate} // Функция для изменения даты
                setCurrentView={setCurrentView} // Функция для изменения текущего заголовка
                setCurrentFilter={setCurrentFilter}
            />
            <Routes>
                <Route
                    path="/register"
                    element={
                        <>
                            <RegisterPage setUsername={setUsername} />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <>
                            <LoginPage setUsername={setUsername} />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <>
                            <ProfilePage />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/"
                    element={
                        <>
                            <main id="main-content">
                                <MovieCarousel />
                                <MovieList selectedDate={selectedDate} currentView={currentView} currentFilter={currentFilter} /> {/* Передаем выбранную дату и текущий заголовок */}
                            </main>
                            <Footer />
                        </>
                    }
                />
            </Routes>

            {/* Добавляем ScrollToTop компонент */}
            <ScrollToTop />
        </div>
    );
};

export default App;
