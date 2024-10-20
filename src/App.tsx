import React, { useState} from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/UI/Header';
import MovieCarousel from './components/MovieCarousel/MovieCarousel';
import { MovieList } from './components/MovieList/MovieList';
import Footer from './components/UI/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ScrollToTop from './components/UI/ScrollToTop';
import CartPage from './pages/CartPage';
import { CartProvider } from './components/MovieList/CartContext.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import EventList from "./components/EventList/EventList.tsx";



type Movie = {
    id: number;
    title: string;
    description: string;
    duration: number;
    category_name: string;
    age_restriction: string;
    image_url: string | null;
};

const App: React.FC = () => {
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [currentView, setCurrentView] = useState<string>('Афиша в городе Владивосток');
    const [currentFilter, setCurrentFilter] = useState<string>('');
    const [movieData, setMovieData] = useState<Movie[]>([]);



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
                        path="/cart"
                        element={
                            <>
                                <CartPage />
                                <Footer />
                            </>
                        }
                    />
                    <Route
                        path="/events"
                        element={
                            <>
                                <main id="main-content">
                                    <MovieCarousel />
                                    <EventList
                                        selectedDate={selectedDate}
                                        currentView={currentView}
                                        currentFilter={currentFilter}
                                    />
                                </main>
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
                                    <MovieList
                                        selectedDate={selectedDate}
                                        currentView={currentView}
                                        currentFilter={currentFilter}
                                        movieData={movieData}
                                    />
                                </main>
                                <Footer />
                            </>
                        }
                    />
                </Routes>
                <ScrollToTop />
            </div>
        </CartProvider>
    );
};

export default App;
