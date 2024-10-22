import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Session } from '../Session/Session.ts';
import SeatSelectionModal from '../Session/SeatSelectionModal.tsx';
import { parse, format } from 'date-fns';
import { useCart } from '../../pages/Cart/CartContext.tsx'; // Используем контекст корзины

type MovieModalProps = {
    show: boolean;
    onHide: () => void;
    movie: {
        id: number;
        title: string;
        description: string;
        image_url: string | null;
        category_name: string;
        age_restriction: string;
        video_url?: string; // Тип должен быть string | undefined, чтобы избежать ошибок
    } | null;
    sessions: Session[];
    onSelectSession: (session: Session) => void;
};

// Функция для корректного отображения времени сеанса
const formatSessionTime = (time: string) => {
    const parsedTime = parse(time, 'HH:mm:ss', new Date());
    return format(parsedTime, 'HH:mm');
};

// Функция для проверки, является ли ссылка YouTube
const isYouTubeUrl = (url: string) => {
    return url.includes('youtu.be') || url.includes('youtube.com');
};

// Функция для получения embed-ссылки для YouTube
const getEmbedUrl = (videoUrl?: string) => {
    if (!videoUrl) return null;
    if (isYouTubeUrl(videoUrl)) {
        const url = new URL(videoUrl);
        const videoId = url.pathname.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return videoUrl; // Если это не YouTube, возвращаем прямую ссылку (например, на MP4)
};

const MovieModal: React.FC<MovieModalProps> = ({ show, onHide, movie, sessions, onSelectSession }) => {
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [showSeatSelection, setShowSeatSelection] = useState(false);
    const [showVideo, setShowVideo] = useState(false); // Состояние для показа видео вместо изображения
    const { addToCart } = useCart(); // Используем контекст корзины

    const videoEmbedUrl = movie?.video_url ? getEmbedUrl(movie.video_url) : null; // Получаем ссылку для встраивания видео или прямую ссылку

    // Обработчик выбора сеанса и показа списка мест
    const handleSessionSelect = (session: Session) => {
        setSelectedSession(session);
        setShowSeatSelection(true); // Показываем выбор мест
        onSelectSession(session); // Передаем выбранный сеанс
    };

    // Обработчик добавления мест в корзину
    const handleSeatsSelected = (selectedSeats: { row: number; seat: number; price: number }[]) => {
        if (!selectedSession) return;

        // Добавляем каждое выбранное место в корзину
        selectedSeats.forEach((seat) => {
            addToCart({
                id: selectedSession.id,
                title: selectedSession.title,
                time: selectedSession.time,
                price: seat.price,
                row: seat.row,
                seat: seat.seat,
                available_tickets: selectedSession.available_tickets,
                quantity: 1, // Для каждого места - один билет
            });
        });

        // После добавления закрываем модалку выбора мест
        setShowSeatSelection(false);
    };

    // Обработчик клика по кнопке для показа видео
    const handlePlayClick = () => {
        setShowVideo(true); // Переключаем состояние на показ видео
    };

    // Обработчик закрытия модального окна
    const handleModalClose = () => {
        setShowVideo(false); // Сбрасываем состояние показа видео
        onHide(); // Закрываем модальное окно
    };

    if (!movie) return null;

    return (
        <Modal show={show} onHide={handleModalClose} centered size="lg"> {/* Увеличиваем размер модального окна */}
            <Modal.Header closeButton>
                <Modal.Title>{movie.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container-fluid row">
                    <div className="col-md-6 position-relative">
                        {!showVideo && videoEmbedUrl ? (
                            <div className="position-relative">
                                <img
                                    src={movie.image_url || '/images/default.jpg'}
                                    alt={movie.title}
                                    className="w-100 mb-3"
                                    style={{ height: '100%', objectFit: 'cover' }} // Обычный размер изображения
                                />
                                {/* Кнопка воспроизведения поверх изображения */}
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
                                        e.currentTarget.style.transform = 'scale(1.2)'; // Увеличение при наведении
                                        e.currentTarget.style.color = '#ffcc00'; // Изменение цвета при наведении
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)'; // Возврат к исходному размеру
                                        e.currentTarget.style.color = '#fff'; // Возврат к исходному цвету
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
                                        src={videoEmbedUrl} // Преобразованная ссылка для YouTube
                                        title="YouTube video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <video width="100%" height="100%" controls autoPlay> {/* Автовоспроизведение MP4 */}
                                        <source src={videoEmbedUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                        ) : (
                            <p>Видео не доступно.</p>
                        )}
                    </div>

                    {/* Правая колонка: Сеансы или выбор мест */}
                    <div className="col-md-6">
                        {!showSeatSelection ? (
                            <>
                                <div className="mb-3">
                                    <strong>Описание:</strong>
                                    <p>{movie.description}</p>
                                </div>
                                <div className="mb-3">
                                    <strong>Категория:</strong> {movie.category_name}
                                </div>
                                <div className="mb-3">
                                    <strong>Возрастное ограничение:</strong> {movie.age_restriction}
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
                                    onSeatsSelected={handleSeatsSelected} // Передаем обработчик для добавления мест в корзину
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

export default MovieModal;
