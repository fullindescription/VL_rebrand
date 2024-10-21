import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate

type Seat = {
    row: number;
    seat: number;
    price: number;
    sessionId: number;
};

type SeatSelectionModalProps = {
    show: boolean;
    onHide: () => void;
    session: {
        id: number;
        time: string;
        price: number;
        available_tickets: number;
    };
    onSeatsSelected: (selectedSeats: Seat[]) => void;
};

const SeatSelectionModal: React.FC<SeatSelectionModalProps> = ({
                                                                   show,
                                                                   onHide,
                                                                   session,
                                                                   onSeatsSelected,
                                                               }) => {
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Для вывода сообщения об ошибке
    const navigate = useNavigate(); // Инициализация для перенаправления

    const maxSeats = 5; // Максимальное количество мест, которые можно выбрать
    const rows = Math.ceil(session.available_tickets / 8);
    const seatsPerRow = 8;

    const toggleSeatSelection = (row: number, seat: number) => {
        const seatIndex = selectedSeats.findIndex((s) => s.row === row && s.seat === seat);

        // Если место уже выбрано, убираем его
        if (seatIndex !== -1) {
            setSelectedSeats((prevSeats) => prevSeats.filter((_, index) => index !== seatIndex));
            setErrorMessage(null); // Убираем сообщение об ошибке
        } else {
            // Проверяем, не превышено ли количество выбранных мест
            if (selectedSeats.length >= maxSeats) {
                setErrorMessage(`Вы не можете выбрать больше ${maxSeats} мест.`);
                return;
            }

            // Добавляем место в выбранные
            setSelectedSeats((prevSeats) => [
                ...prevSeats,
                { row, seat, price: session.price, sessionId: session.id },
            ]);
            setErrorMessage(null); // Убираем сообщение об ошибке
        }
    };

    const isSelected = (row: number, seat: number) => {
        return selectedSeats.some((s) => s.row === row && s.seat === seat);
    };

    const handleConfirmSelection = () => {
        onSeatsSelected(selectedSeats);
        onHide();
        navigate('/cart'); // Перенаправление в корзину
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Выбор мест для сеанса {session.time}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorMessage && (
                    <div className="alert alert-danger text-center">{errorMessage}</div>
                )}
                <div className="d-flex flex-column align-items-center">
                    {[...Array(rows)].map((_, rowIndex) => (
                        <div key={rowIndex} className="d-flex mb-2">
                            {[...Array(seatsPerRow)].map((_, seatIndex) => {
                                const row = rowIndex + 1;
                                const seat = seatIndex + 1;
                                const isSeatDisabled = (rowIndex * seatsPerRow + seat) > session.available_tickets;
                                return (
                                    <div
                                        key={seatIndex}
                                        className={`seat ${isSelected(row, seat) ? 'selected' : ''}`}
                                        onClick={() => !isSeatDisabled && toggleSeatSelection(row, seat)}
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            backgroundColor: isSelected(row, seat) ? 'blue' : 'lightgray',
                                            margin: '2px',
                                            cursor: isSeatDisabled ? 'not-allowed' : 'pointer',
                                        }}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Отмена
                </Button>
                <Button variant="primary" onClick={handleConfirmSelection} disabled={selectedSeats.length === 0}>
                    Подтвердить выбор
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SeatSelectionModal;
