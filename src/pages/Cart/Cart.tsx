import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useCart } from './CartContext.tsx';
import { format, parse } from 'date-fns';
import 'bootstrap-icons/font/bootstrap-icons.css';

const formatSessionTime = (time: string) => {
    const parsedTime = parse(time, 'HH:mm:ss', new Date());
    return format(parsedTime, 'HH:mm');
};

// Функция для получения правильного слова для "билет"
const getTicketLabel = (quantity: number) => {
    if (quantity === 1) return 'билет';
    if (quantity >= 2 && quantity <= 4) return 'билета';
    return 'билетов';
};

type CartProps = {
    show: boolean;
    onHide: () => void;
};

const Cart: React.FC<CartProps> = ({ show, onHide }) => {
    const { cart, removeFromCart, clearCart, total } = useCart();

    const handlePurchase = () => {
        alert('Покупка завершена!');
        clearCart();
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Корзина</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {cart.length > 0 ? (
                    <ul className="list-unstyled">
                        {cart.map((session) => (
                            <li key={session.id} className="mb-2 d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{session.title}</strong>
                                    <div>
                                        <strong>Сеанс:</strong> {formatSessionTime(session.time)}{' '}
                                        <strong>Цена:</strong> {session.price} ₽{' '}
                                        <strong>Количество:</strong> {session.quantity} {getTicketLabel(session.quantity)}
                                    </div>
                                </div>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeFromCart(session.id, session.row, session.seat)}
                                >
                                    <i className="bi bi-trash3-fill"></i> Удалить
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Корзина пуста.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <h5>Итог: {total.toFixed(2)} ₽</h5>
                <Button variant="success" onClick={handlePurchase} disabled={cart.length === 0}>
                    Купить
                </Button>
                <Button variant="secondary" onClick={onHide}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Cart;
