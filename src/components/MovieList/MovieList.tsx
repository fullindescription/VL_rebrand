import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MovieList.scss';

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
};

export const MovieList: React.FC<MovieListProps> = ({ selectedDate }) => {
    const [moviesWithSessions, setMoviesWithSessions] = useState<MovieWithSessions[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    // Фильтрация сессий по выбранной дате
    const filteredMoviesWithSessions = moviesWithSessions
        .map((movieWithSessions) => {
            const filteredSessions = movieWithSessions.sessions.filter((session) => session.date === selectedDate);
            return {
                ...movieWithSessions,
                sessions: filteredSessions,
            };
        })
        .filter((movieWithSessions) => movieWithSessions.sessions.length > 0); // Отфильтровываем фильмы без сессий на выбранную дату

    return (
        <section className="container mt-5 mb-5">
            <h2 className="text-center mb-5">Афиша в городе Владивосток</h2>
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {filteredMoviesWithSessions.length > 0 ? (
                    filteredMoviesWithSessions.map(({ movie, sessions }) => (
                        <div key={movie.id} className="col">
                            <div className="container card bg-dark text-white h-100 d-flex flex-row movie-card p-3">
                                <div className="container position-relative me-3" style={{
                                    backgroundImage: `url(${movie.image_url || '/images/1.jpg'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    width: '450px',
                                    height: '400px',
                                    borderRadius: '10px'
                                }}>
                                    <div className="position-absolute top-0 start-0 m-2 p-1 bg-danger text-white rounded">
                                        {movie.age_restriction}
                                    </div>
                                </div>
                                <div className="container card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <h3 className="card-title">{movie.title}</h3>
                                        <p className="card-text">{movie.category_name}</p>
                                        <p className="card-text">{movie.description}</p>
                                        <p className="card-text">Продолжительность: {movie.duration} мин.</p>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        {sessions.map((session) => (
                                            <div key={session.id} className="bg-secondary text-center text-white mt-2 row rounded">
                                                <p className="mb-0">{session.date} {session.time}</p>
                                                <p className="mb-0">{session.price} ₽</p>
                                                <p className="mb-0">Осталось билетов: {session.available_tickets}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>На выбранную дату сеансов нет.</p>
                )}
            </div>
        </section>
    );
};
