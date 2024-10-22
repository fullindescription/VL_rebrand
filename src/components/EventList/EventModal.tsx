import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Session } from '../Session/Session.ts';
import SeatSelectionModal from '../Session/SeatSelectionModal.tsx';
import { parse, format } from 'date-fns';
import { useCart } from '../../pages/Cart/CartContext.tsx';

type EventModalProps = {
    show: boolean;
    onHide: () => void;
    event: {
        id: number;
        title: string;
        description: string;
        image_url: string | null;
        category_name: string;
        age_restriction: string;
        video_url?: string;
    } | null;
    sessions: Session[];
    onSelectSession: (session: Session) => void;
};

const formatSessionTime = (time: string) => {
    const parsedTime = parse(time, 'HH:mm:ss', new Date());
    return format(parsedTime, 'HH:mm');
};

const isYouTubeUrl = (url: string) => url.includes('youtu.be') || url.includes('youtube.com');

const getEmbedUrl = (videoUrl?: string) => {
    if (!videoUrl) return null;
    if (isYouTubeUrl(videoUrl)) {
        const url = new URL(videoUrl);
        const videoId = url.pathname.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return videoUrl;
};

const EventModal: React.FC<EventModalProps> = ({ show, onHide, event, sessions, onSelectSession }) => {
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [showSeatSelection, setShowSeatSelection] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const { addToCart } = useCart();

    const videoEmbedUrl = event?.video_url ? getEmbedUrl(event.video_url) : null;

    const handleSessionSelect = (session: Session) => {
        setSelectedSession(session);
        setShowSeatSelection(true);
        onSelectSession(session);
    };

    const handleSeatsSelected = (selectedSeats: { row: number; seat: number; price: number }[]) => {
        if (!selectedSession) return;

        selectedSeats.forEach((seat) => {
            addToCart({
                id: selectedSession.id,
                title: selectedSession.title,
                time: selectedSession.time,
                price: seat.price,
                row: seat.row,
                seat: seat.seat,
                available_tickets: selectedSession.available_tickets,
                quantity: 1,
            });
        });

        setShowSeatSelection(false);
    };

    const handlePlayClick = () => setShowVideo(true);
    const handleModalClose = () => {
        setShowVideo(false);
        onHide();
    };

    if (!event) return null;

    return (
        <Modal show={show} onHide={handleModalClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{event.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container-fluid row">
                    <div className="col-md-6 position-relative">
                        {!showVideo && videoEmbedUrl ? (
                            <div className="position-relative">
                                <img
                                    src={event.image_url || '/images/default.jpg'}
                                    alt={event.title}
                                    className="w-100 mb-3"
                                    style={{ height: '100%', objectFit: 'cover' }}
                                />
                                <button
                                    className="btn btn-play position-absolute top-50 start-50 translate-middle"
                                    onClick={handlePlayClick}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '50px',
                                        color: '#fff',
                                        transition: 'transform 0.3s ease, color 0.3s ease',
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
                            </div>
                        ) : videoEmbedUrl ? (
                            <div className="video-container" style={{ width: '100%', height: '100%' }}>
                                {isYouTubeUrl(videoEmbedUrl) ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={videoEmbedUrl}
                                        title="YouTube video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <video width="100%" height="100%" controls autoPlay>
                                        <source src={videoEmbedUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                        ) : (
                            <img
                                src={event.image_url || '/images/default.jpg'}
                                alt={event.title}
                                className="w-100 mb-3"
                                style={{ height: '100%', objectFit: 'cover' }}
                            />
                        )}
                    </div>

                    <div className="col-md-6">
                        {!showSeatSelection ? (
                            <>
                                <div className="mb-3">
                                    <strong>Описание:</strong>
                                    <p>{event.description}</p>
                                </div>
                                <div className="mb-3">
                                    <strong>Категория:</strong> {event.category_name}
                                </div>
                                <div className="mb-3">
                                    <strong>Возрастное ограничение:</strong> {event.age_restriction}
                                </div>

                                <h5>Доступные сеансы</h5>
                                {sessions.length > 0 ? (
                                    sessions.map((session) => (
                                        <div key={session.id} className="d-flex justify-content-between align-items-center mb-2">
                                            <div>
                                                <strong>Сеанс:</strong> {formatSessionTime(session.time)} - {session.price} ₽
                                            </div>
                                            <Button variant="primary" size="sm" onClick={() => handleSessionSelect(session)}>
                                                Выбрать сеанс
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p>Сеансов нет</p>
                                )}
                            </>
                        ) : (
                            selectedSession && (
                                <SeatSelectionModal
                                    show={showSeatSelection}
                                    onHide={() => setShowSeatSelection(false)}
                                    session={selectedSession}
                                    onSeatsSelected={handleSeatsSelected}
                                />
                            )
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EventModal;
