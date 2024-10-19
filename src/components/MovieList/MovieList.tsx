import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MovieList.scss';
import { format, parse } from 'date-fns';
import SessionDetails from './SessionDetails.tsx';

type Movie = {
    id: number;
    title: string;
    description: string;
    duration: number;
    category_name: string;
    age_restriction: string;
    image_url: string | null;
};

type Session = {
    id: number;
    movie_id: number;
    date: string;
    time: string;
    price: string;
    available_tickets: number;
};

type MovieWithSessions = {
    movie: Movie;
    sessions: Session[];
};

type MovieListProps = {
    selectedDate: string;
    currentView: string;
    currentFilter: string;
};

export const MovieList: React.FC<MovieListProps> = ({ selectedDate, currentView  }) => {
    const [moviesWithSessions, setMoviesWithSessions] = useState<MovieWithSessions[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [selectedSessionInfo, setSelectedSessionInfo] = useState<string | null>(null);

    const handleSessionClick = (sessionInfo: string) => {
        setSelectedSessionInfo(sessionInfo);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedSessionInfo(null);
    };

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const url = `/api/events/getfilmsforday/?date=${selectedDate}&time=12:30`; // Запрос по выбранной дате
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const jsonData = await response.json();
                    console.log('Response Data:', jsonData); // Логируем ответ сервера для проверки

                    if (Array.isArray(jsonData.data)) {
                        setMoviesWithSessions(jsonData.data);
                    } else {
                        console.error('Unexpected response format:', jsonData);
                        setMoviesWithSessions([]); // Очистить данные, если формат не ожидаемый
                    }
                } else {
                    setError('Ошибка при загрузке данных.');
                }
            } catch (err) {
                console.error('Network Error:', err);
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

    // Получаем текущее время в формате "HH:mm"
    const currentTime = format(new Date(), 'HH:mm');

    // Функция для фильтрации сессий по времени
    const filterFutureSessions = (sessions: Session[]) => {
        return sessions.filter((session) => {
            // Сравниваем время сеанса с текущим временем
            return session.time < currentTime;
        });
    };

    // Функция для форматирования времени
    const formatSessionTime = (time: string) => {
        const parsedTime = parse(time, 'HH:mm:ss', new Date());
        return format(parsedTime, 'HH:mm');
    };

    // Фильтрация сессий по выбранной дате и текущему времени
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
        .filter((movieWithSessions) => movieWithSessions.sessions.length > 0); // Отфильтровываем фильмы без сессий на выбранную дату

    const getMoviesLabel = (count: number) => {
        if (count === 1) return 'сеанс';
        if (count >= 2 && count <= 4) return 'сеанса';
        return 'сеансов';
    };

    return (
        <section className="container mt-5 mb-5">
            <h2 className="text-center mb-5">{currentView} в городе Владивосток</h2>
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {filteredMoviesWithSessions.length > 0 ? (
                    filteredMoviesWithSessions.map(({ movie, sessions }) => (
                        <div key={movie.id} className="col">
                            <div className="container card bg-dark text-white w-100 h-100 d-flex flex-row movie-card p-3">
                                <div className=" container position-relative me-1 image-container w-50" style={{
                                    backgroundImage: `url(${movie.image_url || '/images/1.jpg'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                                     onClick={() => handleSessionClick(movie.title)}>
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
                                        {sessions.slice(0, 2).map((session) => (
                                            <div key={session.id} className="container bg-secondary text-center session-tile-small  rounded"
                                                 onClick={() => handleSessionClick(movie.title)}>
                                                <p className="session-time">{formatSessionTime(session.time)}</p>
                                                <p className="session-price text-muted">{session.price} ₽</p>
                                                <p className="session-seats text-muted">Комфорт</p>
                                            </div>
                                        ))}
                                        {/* Если есть больше 2 сессий, отображаем +N */}
                                        {sessions.length > 1 && (
                                            <div className="container-fluid bg-secondary d-flex flex-column p-1  sessionN mt-1 text-center  rounded">
                                                <p className="mb-0">
                                                    +{sessions.length - 2} {getMoviesLabel(sessions.length - 2)}
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
            <SessionDetails show={showModal} onHide={closeModal} sessionInfo={selectedSessionInfo || ''} />
        </section>
    );
};
