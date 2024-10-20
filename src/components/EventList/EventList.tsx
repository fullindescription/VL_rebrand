import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EventList.scss';
import { format, parseISO } from 'date-fns';
import SessionDetails from '../MovieList/SessionDetails.tsx';

interface Event {
    id: number;
    name: string;
    description: string;
    date: string;
    price: string;
    age_restriction: string;
    available_tickets: number;
    category_name: string;
    image_url: string | null;
    video_url: string | null;
}

type EventListProps = {
    selectedDate: string;
    currentView: string;
    currentFilter: string;
};

const EventList: React.FC<EventListProps> = ({ selectedDate, currentView, currentFilter }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const closeModal = () => {
        setShowModal(false);
        setSelectedEvent(null);
    };

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const formatEventTime = (date: string) => {
        const parsedDate = parseISO(date);
        return format(parsedDate, 'HH:mm');
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const url = `/api/events/geteventsforday/?date=${selectedDate}&time=12:00`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const jsonData = await response.json();
                    if (Array.isArray(jsonData.data)) {
                        setEvents(jsonData.data);
                    } else {
                        setEvents([]);
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

    return (
        <section className="container mt-5 mb-5">
            <h2 className="text-center mb-5">{currentView} в городе Владивосток</h2>
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div key={event.id} className="col">
                            <div className="container card bg-dark text-white w-100 h-100 d-flex flex-row event-card p-3">
                                <div className="container position-relative me-1 image-container w-50" style={{
                                    backgroundImage: `url(${event.image_url || '/images/1.jpg'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}>
                                    <div className="position-absolute top-0 start-0 m-2 p-1 bg-danger text-white rounded w-auto h-auto">
                                        {event.age_restriction}
                                    </div>
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <div className="container w-auto">
                                        <h3 className="card-title mb-1">{event.name}</h3>
                                        <p className="card-category mt-3">{event.category_name}</p>
                                    </div>
                                    <div className="container d-flex flex-wrap gap-2 mt-1">
                                        <div
                                            className="container bg-secondary text-center session-tile-small rounded"
                                            onClick={() => handleEventClick(event)}
                                        >
                                            <p className="session-time">
                                                <strong>{formatEventTime(event.date)}</strong>
                                            </p>
                                            <p className="session-price text-muted">
                                                <strong>{event.price} ₽</strong>
                                            </p>
                                            <p className="session-seats text-muted">
                                                <strong>Билеты: {event.available_tickets}</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>На выбранную дату событий нет.</p>
                )}
            </div>

            {selectedEvent && (
                <SessionDetails
                    show={showModal}
                    onHide={closeModal}
                    allSessions={[{
                        id: selectedEvent.id,
                        title: selectedEvent.name,
                        date: selectedEvent.date.split('T')[0],
                        time: selectedEvent.date.split('T')[1],
                        price: parseFloat(selectedEvent.price),
                        available_tickets: selectedEvent.available_tickets,
                    }]}
                    selectedSession={{
                        id: selectedEvent.id,
                        title: selectedEvent.name,
                        date: selectedEvent.date.split('T')[0],
                        time: selectedEvent.date.split('T')[1],
                        price: parseFloat(selectedEvent.price),
                        available_tickets: selectedEvent.available_tickets,
                    }}
                    setSelectedSession={() => {}}
                />
            )}
        </section>
    );
};

export default EventList;
