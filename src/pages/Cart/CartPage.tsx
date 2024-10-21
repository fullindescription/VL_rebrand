import React from 'react';
import {Button} from 'react-bootstrap';
import {useCart} from './CartContext.tsx';
import {format, parse} from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const formatSessionTime = (time: string) => {
    const parsedTime = parse(time, 'HH:mm:ss', new Date());
    return format(parsedTime, 'HH:mm');
};

const CartPage: React.FC = () => {
    const {cart, removeFromCart, clearCart, total} = useCart();

    // Добавляем функцию handlePurchase для обработки покупки
    const handlePurchase = async () => {
        try {
            const sessionsToUpdate = cart.reduce<{
                sessionId: number;
                seats: { row: number; seat: number }[]
            }[]>((acc, session) => {
                const existing = acc.find((s) => s.sessionId === session.id);
                if (existing) {
                    existing.seats.push({row: session.row!, seat: session.seat!});
                } else {
                    acc.push({
                        sessionId: session.id,
                        seats: [{row: session.row!, seat: session.seat!}],
                    });
                }
                return acc;
            }, []);

            const response = await fetch('/api/events/update-tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessions: sessionsToUpdate,
                }),
            });

            if (response.ok) {
                alert(`Покупка завершена на сумму ${total.toFixed(2)} ₽!`);
                clearCart();
            } else {
                alert('Произошла ошибка при обработке покупки.');
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
            alert('Не удалось подключиться к серверу.');
        }
    };

    // Группировка билетов по идентификатору, времени и (если есть) месту
    const groupedCart = cart.reduce<{ [key: string]: typeof cart[0] }>((acc, session) => {
        // Создаем уникальный ключ для группировки одинаковых билетов
        const key = `${session.id}-${session.time}-${session.row ?? ''}-${session.seat ?? ''}`;

        if (acc[key]) {
            acc[key].quantity += session.quantity; // Увеличиваем количество билетов
        } else {
            acc[key] = {...session};
        }

        return acc;
    }, {});

    return (
        <div className="container">
            <div className="row justify-content-center align-items-center vh-100">
                <div className="col-md-8 col-lg-6 p-4 shadow-lg rounded-3 bg-white overflow-hidden">
                    <h2 className="mb-4 text-center text-dark">Корзина</h2>
                    {Object.values(groupedCart).length > 0 ? (
                        <>
                            <div
                                className="mb-4"
                                style={{maxHeight: '300px', overflowY: 'auto', paddingRight: '10px'}}
                            >
                                <ul className="list-unstyled mb-4">
                                    {Object.values(groupedCart).map((session, index) => (
                                        <li
                                            key={index}
                                            className="mb-3 p-2 border-bottom d-flex justify-content-between align-items-center"
                                        >
                                            <div className="container d-flex flex-column align-items-center">
                                                <h5 className="mb-2 text-dark text-center">{session.title}</h5>
                                                <div className="d-flex justify-content-between w-10 px-3">
                                                    <small className="d-block me-3">
                                                        <strong>Сеанс:</strong> {formatSessionTime(session.time)}
                                                    </small>
                                                    <small className="d-block me-3">
                                                        <strong>Цена:</strong> {session.price} ₽
                                                    </small>
                                                    <small className="d-block me-3">
                                                        <strong>Количество:</strong> {session.quantity} билета(ов)
                                                    </small>

                                                    {session.row !== undefined && session.seat !== undefined && (
                                                        <small className="d-block">
                                                            <strong>Место:</strong> {session.row} ряд, {session.seat} место
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => removeFromCart(session.id, session.row, session.seat)}
                                            >
                                                <i className="bi bi-trash3-fill"></i>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-4 text-center">
                                <h5 className="fw-bold">Итоговая сумма: {total.toFixed(2)} ₽</h5>
                            </div>
                            <div className="d-flex justify-content-between">
                                <Button variant="danger" onClick={clearCart} className="flex-grow-1 me-2">
                                    <i className="bi bi-x-circle-fill me-1"></i> Удалить всё
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={handlePurchase}
                                    disabled={cart.length === 0}
                                    className="flex-grow-1 ms-2"
                                >
                                    <i className="bi bi-credit-card-fill me-1"></i> Оплатить
                                </Button>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-muted">Корзина пуста.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPage;
