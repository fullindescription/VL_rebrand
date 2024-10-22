import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MovieList.scss';
import { format, parse } from 'date-fns';
import SessionDetails from '../Session/SessionDetails.tsx';
import MovieModal from "./MovieModal.tsx"; // Импортируем новое модальное окно
import { Session } from '../Session/Session.ts'; // Импортируем тип Session

type Movie = {
    id: number;
    title: string;
    description: string;
    duration: number;
    category_name: string;
    age_restriction: string;
    image_url: string | null;
    video_url: string; // Для видео
};

type MovieWithSessions = {
    movie: Movie;
    sessions: Session[];
};

type MovieListProps = {
    selectedDate: string;
    currentView: string;
    currentFilter: string;
    movieData: Movie[]; // Изменяем имя пропса на `movieData`
};

export const MovieList: React.FC<MovieListProps> = ({ selectedDate, currentView, currentFilter }) => {
    const [moviesWithSessions, setMoviesWithSessions] = useState<MovieWithSessions[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [allSessions, setAllSessions] = useState<Session[]>([]);

    // Новые состояния для второго модального окна
    const [showMovieModal, setShowMovieModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedMovieSessions, setSelectedMovieSessions] = useState<Session[]>([]);

    // Получение уникальных жанров из фильмов и создание опций для Select
    const genreOptions = Array.from(new Set(moviesWithSessions.map(({ movie }) => movie.category_name))).map((genre) => ({
        label: genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase(),
        value: genre,
    }));

    const handleSingleSessionClick = (session: Session, movieTitle: string) => {
        setSelectedSession({ ...session, title: movieTitle });
        setShowModal(true);
    };

    const handleAllSessionsClick = (sessions: Session[], movieTitle: string) => {
        if (sessions.length > 0) {
            const sessionsWithTitle = sessions.map((session) => ({
                ...session,
                title: movieTitle,
            }));
            setAllSessions(sessionsWithTitle);
            setSelectedSession(null);
            setShowModal(true);
        }
    };

    // Логика для открытия нового модального окна при клике на кнопку play
    const handleMoviePlayClick = (movie: Movie, sessions: Session[]) => {
        setSelectedMovie(movie);
        setSelectedMovieSessions(sessions);
        setShowMovieModal(true);
    };

    const closeMovieModal = () => {
        setShowMovieModal(false);
        setSelectedMovie(null);
        setSelectedMovieSessions([]);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedSession(null);
        setAllSessions([]);
    };

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const url = `/api/events/getfilmsforday/?date=${selectedDate}&time=10:00`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const jsonData = await response.json();
                    if (Array.isArray(jsonData.data)) {
                        const normalizedData = jsonData.data.map((item: any) => ({
                            ...item,
                            sessions: item.sessions.map((session: any) => ({
                                ...session,
                                price: parseFloat(session.price),
                                available_tickets: parseInt(session.available_tickets, 10),
                            })),
                        }));
                        setMoviesWithSessions(normalizedData);
                    } else {
                        setMoviesWithSessions([]);
                    }
                } else {
                    setError('Ошибка при загрузке данных.');
                }
            } catch (err) {
                setError('Ошибка сети.');
            } finally {
                setLoading(false);
            }
        };

        if (currentFilter === 'movies') {
            fetchMovies();
        }
    }, [selectedDate, currentFilter]);

    if (loading) {
        return <p>Загрузка фильмов...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const currentTime = format(new Date(), 'HH:mm');

    const filterFutureSessions = (sessions: Session[]) => {
        return sessions.filter((session) => session.time < currentTime);
    };

    const formatSessionTime = (time: string) => {
        const parsedTime = parse(time, 'HH:mm:ss', new Date());
        return format(parsedTime, 'HH:mm');
    };

    const filteredMoviesWithSessions = moviesWithSessions
        .map((movieWithSessions) => {
            const futureSessions = filterFutureSessions(
                movieWithSessions.sessions.filter((session) => session.date === selectedDate)
            );
            return {
                ...movieWithSessions,
                sessions: futureSessions,
            };
        })
        .filter((movieWithSessions) => movieWithSessions.sessions.length > 0);

    const getMoviesLabel = (count: number) => {
        if (count === 1) return 'сеанс';
        if (count >= 2 && count <= 4) return 'сеанса';
        return 'сеансов';
    };

    // Фильтрация фильмов по выбранным жанрам
    const moviesToDisplay = selectedGenres.length > 0
        ? filteredMoviesWithSessions.filter(({ movie }) =>
            selectedGenres.some((genre) => movie.category_name.toLowerCase() === genre.toLowerCase())
        )
        : filteredMoviesWithSessions;

    return (
        <section className="container mt-5 mb-5">
            <h2 className="text-center mb-5">{currentView} в городе Владивосток</h2>

            {/* Select для выбора жанра с поиском и поддержкой множественного выбора */}
            <div className="mb-4 d-flex align-items-center justify-content-start genre-select-container">
                <label htmlFor="genreSelect" className="form-label genre-select-label me-3">
                    Выберите жанры:
                </label>
                <Select
                    id="genreSelect"
                    className="genre-select-dropdown flex-grow-1"
                    classNamePrefix="genre-select"
                    options={genreOptions}
                    placeholder="Выберите жанры..."
                    isMulti
                    isClearable
                    onChange={(selectedOptions) =>
                        setSelectedGenres(selectedOptions ? selectedOptions.map((option) => option.value) : [])
                    }
                />
            </div>
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {moviesToDisplay.length > 0 ? (
                    moviesToDisplay.map(({ movie, sessions }) => (
                        <div key={movie.id} className="col">
                            <div className="container card bg-dark text-white w-100 h-100 d-flex flex-row movie-card p-3">
                                {/* Кнопка Play поверх изображения */}
                                <div
                                    className="container position-relative me-1 image-container w-50"
                                    style={{
                                        backgroundImage: `url(${movie.image_url || '/images/1.jpg'})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    <button
                                        className="btn btn-play position-absolute top-50 start-50 translate-middle"
                                        onClick={() => handleMoviePlayClick(movie, sessions)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '50px',
                                            color: '#fff',
                                            transition: 'transform 0.3s ease, color 0.3s ease',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.2)';
                                            e.currentTarget.style.color = '#ffcc00';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.color = '#fff';
                                        }}
                                    >
                                        <i className="bi bi-play-circle"></i>
                                    </button>
                                    <div
                                        className="position-absolute top-0 start-0 m-2 p-1 bg-danger text-white rounded w-auto h-auto">
                                        {movie.age_restriction}
                                    </div>
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <div className="container w-auto">
                                        <h3 className="card-title mb-1">{movie.title}</h3>
                                        <p className="card-category mt-3">{movie.category_name}</p>
                                    </div>
                                    <div className="container d-flex flex-wrap gap-2 mt-1 ">
                                        {sessions.slice(0, 1).map((session) => (
                                            <div
                                                key={session.id}
                                                className="container bg-secondary text-center session-tile-small rounded"
                                                onClick={() => handleSingleSessionClick(session, movie.title)}
                                            >
                                                <p className="session-time">
                                                    <strong>{formatSessionTime(session.time)}</strong>
                                                </p>
                                                <p className="session-price text-muted">
                                                    <strong>{session.price} ₽</strong>
                                                </p>
                                                <p className="session-seats text-muted"><strong>Комфорт</strong></p>
                                            </div>
                                        ))}

                                        {sessions.length > 1 && (
                                            <div
                                                className="container-fluid bg-secondary d-flex flex-column p-1 sessionN mt-1 text-center rounded"
                                                onClick={() => handleAllSessionsClick(sessions, movie.title)}
                                            >
                                                <p className="mb-0">
                                                    <strong>+{sessions.length - 1} {getMoviesLabel(sessions.length - 1)}</strong>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>На выбранную дату сеансов нет.</p>
                )}
            </div>

            {/* Модальное окно для сеансов */}
            <SessionDetails
                show={showModal}
                onHide={closeModal}
                allSessions={allSessions.length ? allSessions : selectedSession ? [selectedSession] : []}
                selectedSession={selectedSession}
                setSelectedSession={setSelectedSession}
                isEvent={false}
            />

            {/* Модальное окно для информации о фильме и сеансах */}
            <MovieModal
                show={showMovieModal}
                onHide={closeMovieModal}
                movie={selectedMovie}
                sessions={selectedMovieSessions}
                onSelectSession={(session) => {
                    setSelectedSession(session);
                    setShowModal(true); // Перенаправляем в окно выбора мест
                }}
            />
        </section>
    );
};
