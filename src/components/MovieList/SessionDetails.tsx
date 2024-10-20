import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { format, parse } from 'date-fns';
import { useCart } from './CartContext.tsx';
import SeatSelectionModal from "./SeatSelectionModal.tsx";
import { Session } from './types.ts'; // Импортируем тип

type SessionDetailsProps = {
    show: boolean;
    onHide: () => void;
    allSessions: Session[];
    selectedSession: Session | null;
    setSelectedSession: (session: Session | null) => void;
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
                                                       }) => {
    const { addToCart } = useCart();
    const [showSeatSelection, setShowSeatSelection] = useState(false);

    // Пример кода в SessionDetails
    const handleAddToCart = (selectedSeats: { row: number; seat: number; price: number; sessionId: number }[]) => {
        selectedSeats.forEach((seat) => {
            addToCart({
                id: seat.sessionId,
                title: selectedSession!.title, // Используем title здесь
                time: selectedSession!.time,
                price: seat.price,
                row: seat.row,
                seat: seat.seat,
                available_tickets: selectedSession!.available_tickets,
            });
        });
        setShowSeatSelection(false);
    };



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
                            <Button variant="primary" size="sm" onClick={() => handleSelectSeats(selectedSession)}>
                                Выбрать места
                            </Button>
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
                                        onClick={() => setSelectedSession({ ...session, title: session.title })} // Передаем title
                                    >
                                        Выбрать места
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

            {selectedSession && (
                <SeatSelectionModal
                    show={showSeatSelection}
                    onHide={() => setShowSeatSelection(false)}
                    session={{
                        ...selectedSession,
                        occupiedSeats: selectedSession.occupiedSeats || [], // Передаем занятые места или пустой массив
                    }}
                    onSeatsSelected={handleAddToCart}
                />
            )}
        </>
    );
};

export default SessionDetails;
