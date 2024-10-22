import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { format, parse } from 'date-fns';
import './HomeList.scss';
import SessionDetails from '../Session/SessionDetails.tsx';
import HomeModal from './HomeModal.tsx'; // Импортируем модальное окно для фильмов и событий

type EventOrMovie = {
    id: number;
    title: string;
    description: string;
    duration: number;
    category_name: string;
    age_restriction: string;
    image_url: string | null;
    video_url?: string;
    sessions: any[];
};

type HomeListProps = {
    selectedDate: string;
    currentView: string;
};

const HomeList: React.FC<HomeListProps> = ({ selectedDate, currentView }) => {
    const [itemsWithSessions, setItemsWithSessions] = useState<EventOrMovie[]>([]);
    const [showHomeModal, setShowHomeModal] = useState(false);
    const [showSessionDetails, setShowSessionDetails] = useState(false);
    const [selectedItem, setSelectedItem] = useState<EventOrMovie | null>(null);
    const [selectedSession, setSelectedSession] = useState<any | null>(null);
    const [allSessions, setAllSessions] = useState<any[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [genreOptions, setGenreOptions] = useState<{ label: string; value: string }[]>([]);

    // Обработчик открытия модального окна для описания (HomeModal)
    const handleItemClick = (item: EventOrMovie) => {
        setSelectedItem(item);
        setAllSessions(item.sessions); // Передаем все сеансы в модальное окно
        setShowHomeModal(true);
    };

    // Обработчик открытия окна для выбора мест (SessionDetails)
    const handleSingleSessionClick = (session: any, item: EventOrMovie) => {
        setSelectedSession({ ...session, title: item.title });
        setShowHomeModal(false); // Скрываем HomeModal, но не закрываем
        setShowSessionDetails(true);
    };

    const handleAllSessionsClick = (sessions: any[], title: string) => {
        setAllSessions(sessions);
        console.log("Title:", title); // Или используйте `title` в логике
        setShowHomeModal(true);
    };


    // Закрытие модального окна для описания
    const closeHomeModal = () => {
        setShowHomeModal(false);
        setSelectedItem(null);
        setSelectedSession(null);
        setAllSessions([]);
    };

    // Закрытие окна для выбора мест (SessionDetails)
    const closeSessionDetails = () => {
        setShowSessionDetails(false);
        setShowHomeModal(true); // После закрытия SessionDetails возвращаемся к HomeModal
    };

    // Fetch данных
    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentTime = format(new Date(), 'HH:mm'); // Получаем текущее время здесь

                // Передаем текущее время в запросы к API
                const [eventsResponse, moviesResponse] = await Promise.all([
                    fetch(`/api/events/geteventsforday/?date=${selectedDate}&time=${currentTime}`),
                    fetch(`/api/events/getfilmsforday/?date=${selectedDate}&time=${currentTime}`),
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

                    const allItems = [...normalizedEvents, ...normalizedMovies];
                    setItemsWithSessions(allItems);

                    const genreOptions = Array.from(new Set(allItems.map(({ category_name }) => category_name)))
                        .map((genre) => ({
                            label: genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase(),
                            value: genre,
                        }));

                    setGenreOptions(genreOptions);
                }
            } catch (err) {
                console.error('Ошибка сети');
            }
        };

        fetchData();
    }, [selectedDate]);

    // Убираем фильтрацию по времени
    const filterFutureSessions = (sessions: any[]) => {
        return sessions; // Возвращаем все сессии без фильтрации
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
        .filter((item) =>
            item.sessions.length > 0 &&
            (selectedGenres.length === 0 || selectedGenres.some((genre) =>
                genre.toLowerCase().trim() === item.category_name.toLowerCase().trim()))
        );


    const getMoviesLabel = (count: number) => {
        if (count === 1) return 'сеанс';
        if (count >= 2 && count <= 4) return 'сеанса';
        return 'сеансов';
    };

    return (
        <section className="home-list container mt-5 mb-5">
            <h2 className="text-center mb-5">{currentView} в городе Владивосток</h2>

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
                {filteredItemsWithSessions.length > 0 ? (
                    filteredItemsWithSessions.map((item, index) => (
                        <div key={`${item.id}-${index}`}
                             className="col"> {/* Используем item.id и индекс для уникальности */}
                            <div
                                className="container card bg-dark text-white w-100 h-100 d-flex flex-row home-card p-3">
                                {/* Клик на изображение для открытия модального окна с описанием */}
                                <div
                                    className="container position-relative me-1 image-container w-50"
                                    style={{
                                        backgroundImage: `url(${item.image_url || '/images/1.jpg'})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                    onClick={() => handleItemClick(item)} // Клик для показа описания
                                >
                                    <button
                                        className="btn btn-play position-absolute top-50 start-50 translate-middle"
                                        onClick={() => handleItemClick(item)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '50px',
                                            color: '#fff',
                                            transition: 'transform 0.3s ease, color 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.2)';
                                            e.currentTarget.style.color = '#ffcc00'; // Изменение цвета при наведении
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
                                                onClick={() => handleSingleSessionClick(session, item)}
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


            {/* Модальное окно для выбора мест (SessionDetails) */}
            <SessionDetails
                show={showSessionDetails}
                onHide={closeSessionDetails}
                allSessions={allSessions}
                selectedSession={selectedSession}
                setSelectedSession={setSelectedSession}
                isEvent={false} // Индикатор для событий
            />

            {/* Модальное окно для описания (HomeModal) */}
            <HomeModal
                show={showHomeModal}
                onHide={closeHomeModal}
                item={selectedItem}
                sessions={allSessions} // Передаем все сеансы в модальное окно
                onSelectSession={(session) => {
                    setSelectedSession(session);
                    setShowSessionDetails(true); // Открываем модальное окно выбора мест
                }}
            />
        </section>
    );
};

export default HomeList;
