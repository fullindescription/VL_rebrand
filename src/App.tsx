import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/UI/Header';
import MovieCarousel from './components/MovieCarousel/MovieCarousel';
import { MovieList } from './components/MovieList/MovieList';
import Footer from './components/UI/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
    const [selectedDate, setSelectedDate] = useState<string>('2024-10-17'); // Начальная дата

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
                selectedDateString={selectedDate} // Передаем строку даты в Header
                setSelectedDate={setSelectedDate} // Функция для изменения даты
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
                                <MovieList selectedDate={selectedDate} /> {/* Передаем выбранную дату */}
                            </main>
                            <Footer />
                        </>
                    }
                />
            </Routes>
        </div>
    );
};

export default App;
