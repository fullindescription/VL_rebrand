import React from 'react';
import Header from './components/UI/Header';
import MovieCarousel from './components/MovieCarousel/MovieCarousel';
import { MovieList } from './components/MovieList/MovieList';
import Footer from './components/UI/Footer';
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

const App: React.FC = () => {
    return (
        <div className="App">
            <Routes>
                <Route
                    path="/register"
                    element={
                        <>
                            <Header title="VL.RU" />
                            <RegisterPage />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <>
                            <Header title="VL.RU" />
                            <LoginPage />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/"
                    element={
                        <>
                            <Header title="VL.RU" />
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
