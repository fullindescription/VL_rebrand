import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/UI/Header';
import MovieCarousel from './components/MovieCarousel/MovieCarousel';
import { MovieList } from './components/MovieList/MovieList';
import Footer from './components/UI/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';  // Импорт страницы профиля
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

    useEffect(() => {
        if (username) {
            localStorage.setItem('username', username);
        } else {
            localStorage.removeItem('username');
        }

    }, [username]);


    return (
        <div className="App">
            <Header title="VL.RU" username={username} setUsername={setUsername} />
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
                            <ProfilePage />  {/* Страница профиля */}
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
                                <MovieList />
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
