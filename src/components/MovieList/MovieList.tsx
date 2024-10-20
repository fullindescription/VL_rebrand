import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MovieList.scss';
import { format, parse } from 'date-fns';
import SessionDetails from './SessionDetails.tsx';
import { Session } from './types'; // Импортируем тип

type Movie = {
    id: number;
    title: string;
    description: string;
    duration: number;
    category_name: string;
    age_restriction: string;
    image_url: string | null;
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

export const MovieList: React.FC<MovieListProps> = ({ selectedDate, currentView, currentFilter, }) => {
    const [moviesWithSessions, setMoviesWithSessions] = useState<MovieWithSessions[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [allSessions, setAllSessions] = useState<Session[]>([]);

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

    const closeModal = () => {
        setShowModal(false);
        setSelectedSession(null);
        setAllSessions([]);
    };

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const url = `/api/events/getfilmsforday/?date=${selectedDate}&time=00:01`;
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
        fetchMovies();
    }, [selectedDate]);

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

    // Проверяем фильтр на "movies" перед отрисовкой
    if (currentFilter === 'movies') {
        return (
            <section className="container mt-5 mb-5">
                <h2 className="text-center mb-5">{currentView} в городе Владивосток</h2>
                <div className="row row-cols-1 row-cols-md-2 g-4">
                    {filteredMoviesWithSessions.length > 0 ? (
                        filteredMoviesWithSessions.map(({ movie, sessions }) => (
                            <div key={movie.id} className="col">
                                <div className="container card bg-dark text-white w-100 h-100 d-flex flex-row movie-card p-3">
                                    <div className="container position-relative me-1 image-container w-50" style={{
                                        backgroundImage: `url(${movie.image_url || '/images/1.jpg'})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}>
                                        <div className="position-absolute top-0 start-0 m-2 p-1 bg-danger text-white rounded w-auto h-auto">
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
                <SessionDetails
                    show={showModal}
                    onHide={closeModal}
                    allSessions={allSessions.length ? allSessions : selectedSession ? [selectedSession] : []}
                    selectedSession={selectedSession}
                    setSelectedSession={setSelectedSession}
                />
            </section>
        );
    }
    return null;
};
