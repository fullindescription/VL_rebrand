import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import './EventList.scss';
import { format, parse } from 'date-fns';
import SessionDetails from '../Session&SeatSelection/Session/SessionDetails.tsx';
import EventModal from './EventModal.tsx'; // Импортируем новое модальное окно для событий
import { Session } from '../Session&SeatSelection/Session/Session.ts';

interface Event {
    id: number;
    title: string;
    description: string;
    duration: number;
    category_name: string;
    age_restriction: string;
    image_url: string | null;
    video_url: string;
}

interface EventWithSessions {
    event: Event;
    sessions: Session[];
}

type EventListProps = {
    selectedDate: string;
    currentView: string;
    currentFilter: string;
};

const EventList: React.FC<EventListProps> = ({ selectedDate, currentView, currentFilter }) => {
    const [eventsWithSessions, setEventsWithSessions] = useState<EventWithSessions[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [allSessions, setAllSessions] = useState<Session[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [selectedEventSessions, setSelectedEventSessions] = useState<Session[]>([]); // Для модального окна событий
    const [showEventModal, setShowEventModal] = useState(false); // Модальное окно для событий

    const handleSingleSessionClick = (session: Session, eventTitle: string) => {
        setSelectedSession({ ...session, title: eventTitle });
        setShowModal(true);
    };

    const handleAllSessionsClick = (sessions: Session[], eventTitle: string) => {
        if (sessions.length > 0) {
            const sessionsWithTitle = sessions.map((session) => ({
                ...session,
                title: eventTitle,
            }));
            setAllSessions(sessionsWithTitle);
            setSelectedSession(null);
            setShowModal(true);
        }
    };

    // Открытие модального окна события
    const handleEventPlayClick = (event: Event, sessions: Session[]) => {
        setSelectedEvent(event);
        setSelectedEventSessions(sessions);
        setShowEventModal(true);
    };

    const closeEventModal = () => {
        setShowEventModal(false);
        setSelectedEvent(null);
        setSelectedEventSessions([]);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedSession(null);
        setAllSessions([]);
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const currentTime = format(new Date(), 'HH:mm'); // Получаем текущее время
                const url = `/api/events/geteventsforday/?date=${selectedDate}&time=${currentTime}`; // Передаем текущее время в запрос
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
                            event: item.event,
                            sessions: item.sessions.map((session: any) => ({
                                ...session,
                                price: parseFloat(session.price),
                                available_tickets: parseInt(session.available_tickets, 10),
                            })),
                        }));
                        setEventsWithSessions(normalizedData);
                    } else {
                        setEventsWithSessions([]);
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

        if (currentFilter === 'events') {
            fetchEvents();
        }
    }, [selectedDate, currentFilter]);

    if (loading) return <p>Загрузка событий...</p>;
    if (error) return <p>{error}</p>;

    // Убираем фильтрацию по времени
    const filterFutureSessions = (sessions: Session[]) => {
        return sessions; // Возвращаем все сессии
    };

    const formatSessionTime = (time: string) => {
        const parsedTime = parse(time, 'HH:mm:ss', new Date());
        return format(parsedTime, 'HH:mm');
    };

    const filteredEventsWithSessions = eventsWithSessions
        .map((eventWithSessions) => {
            const futureSessions = filterFutureSessions(
                eventWithSessions.sessions.filter((session) => session.date === selectedDate)
            );
            return {
                ...eventWithSessions,
                sessions: futureSessions,
            };
        })
        .filter(
            (eventWithSessions) =>
                eventWithSessions.sessions.length > 0 &&
                (selectedGenres.length === 0 || selectedGenres.includes(eventWithSessions.event.category_name))
        );

    const getMoviesLabel = (count: number) => {
        if (count === 1) return 'сеанс';
        if (count >= 2 && count <= 4) return 'сеанса';
        return 'сеансов';
    };

    const genreOptions = Array.from(new Set(eventsWithSessions.map(({ event }) => event.category_name))).map((genre) => ({
        label: genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase(),
        value: genre,
    }));

    return (
        <section className="container mt-5 mb-5">
            <h2 className="text-center mb-5">{currentView} в городе Владивосток</h2>

            {/* Выпадающий список для выбора жанров */}
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
                {filteredEventsWithSessions.length > 0 ? (
                    filteredEventsWithSessions.map(({ event, sessions }) => (
                        <div key={event.id} className="col">
                            <div className="container card text-white w-100 h-100 d-flex flex-row event-card p-3">
                                <div
                                    className="container position-relative me-1 image-container w-50"
                                    style={{
                                        backgroundImage: `url(${event.image_url || '/images/1.jpg'})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    <button
                                        className="btn btn-play position-absolute top-50 start-50 translate-middle"
                                        onClick={() => handleEventPlayClick(event, sessions)}
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
                                    <div className="position-absolute top-0 start-0 m-2 p-1 bg-danger text-white rounded w-auto h-auto">
                                        {event.age_restriction}
                                    </div>
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <div className="container w-auto">
                                        <h3 className="card-title mb-1">{event.title}</h3>
                                        <p className="card-category mt-3">{event.category_name}</p>
                                    </div>
                                    <div className="container d-flex flex-wrap gap-2 mt-1 ">
                                        {sessions.slice(0, 1).map((session) => (
                                            <div
                                                key={session.id}
                                                className="container bg-secondary text-center session-tile-small rounded"
                                                onClick={() => handleSingleSessionClick(session, event.title)}
                                            >
                                                <p className="session-time">
                                                    <strong>{formatSessionTime(session.time)}</strong>
                                                </p>
                                                <p className="session-price text-muted">
                                                    <strong>{session.price} ₽</strong>
                                                </p>
                                                <p className="session-seats text-muted">
                                                    <strong>Комфорт</strong>
                                                </p>
                                            </div>
                                        ))}

                                        {sessions.length > 1 && (
                                            <div
                                                className="container-fluid bg-secondary d-flex flex-column p-1 sessionN mt-1 text-center rounded"
                                                onClick={() => handleAllSessionsClick(sessions, event.title)}
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
                    <p>На выбранную дату событий нет.</p>
                )}
            </div>

            <SessionDetails
                show={showModal}
                onHide={closeModal}
                allSessions={allSessions.length ? allSessions : selectedSession ? [selectedSession] : []}
                selectedSession={selectedSession}
                setSelectedSession={setSelectedSession}
                isEvent={false}
            />

            {/* Модальное окно для событий */}
            <EventModal
                show={showEventModal}
                onHide={closeEventModal}
                event={selectedEvent}
                sessions={selectedEventSessions}
                onSelectSession={(session) => {
                    setSelectedSession(session);
                    setShowModal(true); // Перенаправляем в окно выбора мест
                }}
            />
        </section>
    );
};

export default EventList;
