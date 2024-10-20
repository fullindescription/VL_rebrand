import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useCart } from './CartContext';
import { format, parse } from 'date-fns';

const formatSessionTime = (time: string) => {
    const parsedTime = parse(time, 'HH:mm:ss', new Date());
    return format(parsedTime, 'HH:mm');
};

type CartProps = {
    show: boolean;
    onHide: () => void;
};

const Cart: React.FC<CartProps> = ({ show, onHide }) => {
    const { cart, removeFromCart, clearCart } = useCart();

    const handlePurchase = () => {
        // Здесь реализуйте логику для обработки покупки
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
                                    <strong>Сеанс:</strong> {formatSessionTime(session.time)}{' '}
                                    <strong>Цена:</strong> {session.price} ₽
                                </div>
                                <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(session.id)}>
                                    Удалить
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Корзина пуста.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
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
