import React, { useEffect, useState } from 'react';
import { format, parse } from 'date-fns';
import './HomeList.scss';
import SessionDetails from '../Session/SessionDetails.tsx'; // Подключение общих деталей сеанса

type EventOrMovie = {
    id: number;
    title: string;
    description: string;
    duration: number;
    category_name: string;
    age_restriction: string;
    image_url: string | null;
    video_url: string | null;
    sessions: any[];
};

type HomeListProps = {
    selectedDate: string;
    currentView: string;
    currentFilter: string;
};

const HomeList: React.FC<HomeListProps> = ({ selectedDate, currentView }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [itemsWithSessions, setItemsWithSessions] = useState<EventOrMovie[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<any | null>(null);
    const [allSessions, setAllSessions] = useState<any[]>([]);

    const handleSingleSessionClick = (session: any, title: string) => {
        setSelectedSession({ ...session, title });
        setShowModal(true);
    };

    const handleAllSessionsClick = (sessions: any[], title: string) => {
        if (sessions.length > 0) {
            const sessionsWithTitle = sessions.map((session) => ({
                ...session,
                title,
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
        const fetchData = async () => {
            try {
                const [eventsResponse, moviesResponse] = await Promise.all([
                    fetch(`/api/events/geteventsforday/?date=${selectedDate}&time=12:00`),
                    fetch(`/api/events/getfilmsforday/?date=${selectedDate}&time=10:00`),
                ]);

                if (eventsResponse.ok && moviesResponse.ok) {
                    const eventsData = await eventsResponse.json();
                    const moviesData = await moviesResponse.json();

                    const normalizedEvents = (eventsData.data || []).map((item: any) => ({
                        ...item.event,
                        sessions: item.sessions,
                    }));

                    const normalizedMovies = (moviesData.data || []).map((item: any) => ({
                        ...item.movie,
                        sessions: item.sessions,
                    }));

                    setItemsWithSessions([...normalizedEvents, ...normalizedMovies]);
                } else {
                    setError('Ошибка при загрузке данных.');
                }
            } catch (err) {
                setError('Ошибка сети.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedDate]);

    if (loading) {
        return <p>Загрузка...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const currentTime = format(new Date(), 'HH:mm');

    const filterFutureSessions = (sessions: any[]) => {
        return sessions.filter((session) => session.time > currentTime);
    };

    const formatSessionTime = (time: string) => {
        const parsedTime = parse(time, 'HH:mm:ss', new Date());
        return format(parsedTime, 'HH:mm');
    };

    const filteredItemsWithSessions = itemsWithSessions
        .map((item) => {
            const futureSessions = filterFutureSessions(
                item.sessions.filter((session) => session.date === selectedDate)
            );
            return {
                ...item,
                sessions: futureSessions,
            };
        })
        .filter((item) => item.sessions.length > 0);

    const getMoviesLabel = (count: number) => {
        if (count === 1) return 'сеанс';
        if (count >= 2 && count <= 4) return 'сеанса';
        return 'сеансов';
    };

    return (
        <section className="home-list container mt-5 mb-5">
            <h2 className="text-center mb-5">{currentView} в городе Владивосток</h2>
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {filteredItemsWithSessions.length > 0 ? (
                    filteredItemsWithSessions.map((item) => (
                        <div key={item.id} className="col">
                            <div className="container card bg-dark text-white w-100 h-100 d-flex flex-row home-card p-3">
                                <div className="container position-relative me-1 image-container w-50" style={{
                                    backgroundImage: `url(${item.image_url || '/images/1.jpg'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}>
                                    <div className="position-absolute top-0 start-0 m-2 p-1 bg-danger text-white rounded w-auto h-auto">
                                        {item.age_restriction}
                                    </div>
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <div className="container w-auto">
                                        <h3 className="card-title mb-1">{item.title}</h3>
                                        <p className="card-category mt-3">{item.category_name}</p>
                                    </div>
                                    <div className="container d-flex flex-wrap gap-2 mt-1">
                                        {item.sessions.slice(0, 1).map((session) => (
                                            <div
                                                key={session.id}
                                                className="container bg-secondary text-center session-tile-small rounded"
                                                onClick={() => handleSingleSessionClick(session, item.title)}
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

                                        {item.sessions.length > 1 && (
                                            <div
                                                className="container-fluid bg-secondary d-flex flex-column p-1 sessionN mt-1 text-center rounded"
                                                onClick={() => handleAllSessionsClick(item.sessions, item.title)}
                                            >
                                                <p className="mb-0">
                                                    <strong>+{item.sessions.length - 1} {getMoviesLabel(item.sessions.length - 1)}</strong>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>На выбранную дату событий нет.</p>
                )}
            </div>
            <SessionDetails
                show={showModal}
                onHide={closeModal}
                allSessions={allSessions.length ? allSessions : selectedSession ? [selectedSession] : []}
                selectedSession={selectedSession}
                setSelectedSession={setSelectedSession}
                isEvent={true}
            />
        </section>
    );
};

export default HomeList;
