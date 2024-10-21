import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { format, parse } from 'date-fns';
import { useCart } from '../../pages/Cart/CartContext.tsx';
import SeatSelectionModal from "./SeatSelectionModal.tsx";
import { Session } from './Session.ts'; // Импортируем тип
import { useNavigate } from 'react-router-dom';

type SessionDetailsProps = {
    show: boolean;
    onHide: () => void;
    allSessions: Session[];
    selectedSession: Session | null;
    setSelectedSession: (session: Session | null) => void;
    isEvent: boolean;
};

const formatSessionTime = (time: string) => {
    const parsedTime = parse(time, 'HH:mm:ss', new Date());
    return format(parsedTime, 'HH:mm');
};

const SessionDetails: React.FC<SessionDetailsProps> = ({
                                                           show,
                                                           onHide,
                                                           allSessions,
                                                           selectedSession,
                                                           setSelectedSession,
                                                           isEvent,
                                                       }) => {
    const { addToCart } = useCart();
    const [showSeatSelection, setShowSeatSelection] = useState(false);
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const navigate = useNavigate();

    // Обработчик для изменения количества билетов
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 1 && value <= (selectedSession?.available_tickets || 1)) {
            setTicketQuantity(value);
        }
    };

    // Обработчик для добавления события (с выбором количества) в корзину и перехода в корзину
    const handleAddToCartForEvent = () => {
        if (selectedSession) {
            addToCart({
                id: selectedSession.id,
                title: selectedSession.title,
                time: selectedSession.time,
                price: selectedSession.price,
                available_tickets: selectedSession.available_tickets,
                quantity: ticketQuantity // Добавляем правильное количество
            });
            onHide();
            navigate('/cart');
        }
    };


    // Обработчик для выбора мест (только для фильмов)
    const handleSelectSeats = (session: Session) => {
        setSelectedSession(session); // Устанавливаем выбранный сеанс
        setShowSeatSelection(true);
    };

    return (
        <>
            <Modal show={show} onHide={onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedSession ? 'Информация о сеансе' : 'Все доступные сеансы'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedSession ? (
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>Время:</strong> {formatSessionTime(selectedSession.time)}{' '}
                                <strong>Цена:</strong> {selectedSession.price} ₽{' '}
                                <strong>Мест:</strong> {selectedSession.available_tickets}
                            </div>
                            {isEvent ? (
                                <>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        max={selectedSession.available_tickets}
                                        value={ticketQuantity}
                                        onChange={handleQuantityChange}
                                        className="me-2"
                                        style={{ width: '60px' }}
                                    />
                                    <Button variant="primary" size="sm" onClick={handleAddToCartForEvent}>
                                        Купить {ticketQuantity} {ticketQuantity === 1 ? 'билет' : 'билета(ов)'}
                                    </Button>
                                </>
                            ) : (
                                <Button variant="primary" size="sm" onClick={() => handleSelectSeats(selectedSession)}>
                                    Выбрать места
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <h5>Все сеансы</h5>
                            {allSessions.map((session) => (
                                <div key={session.id} className="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                        <strong>Время:</strong> {formatSessionTime(session.time)}{' '}
                                        <strong>Цена:</strong> {session.price} ₽{' '}
                                        <strong>Мест:</strong> {session.available_tickets}
                                    </div>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => setSelectedSession({ ...session, title: session.title })}
                                    >
                                        {isEvent ? 'Купить билет' : 'Выбрать места'}
                                    </Button>
                                </div>
                            ))}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>

            {!isEvent && selectedSession && (
                <SeatSelectionModal
                    show={showSeatSelection}
                    onHide={() => setShowSeatSelection(false)}
                    session={selectedSession}
                    onSeatsSelected={(selectedSeats) => {
                        // Добавляем выбранные места в корзину
                        selectedSeats.forEach((seat) => {
                            addToCart({
                                id: seat.sessionId,
                                title: selectedSession.title,
                                time: selectedSession.time,
                                price: seat.price,
                                row: seat.row,
                                seat: seat.seat,
                                available_tickets: selectedSession.available_tickets,
                                quantity: 1 // Количество при выборе мест
                            });
                        });
                        setShowSeatSelection(false);
                        navigate('/cart'); // Перенаправление в корзину
                    }}
                />
            )}
        </>
    );
};

export default SessionDetails;
