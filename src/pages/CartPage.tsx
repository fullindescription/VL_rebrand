import React from 'react';
import { Button } from 'react-bootstrap';
import { useCart } from '../components/MovieList/CartContext';
import { format, parse } from 'date-fns';

const formatSessionTime = (time: string) => {
    const parsedTime = parse(time, 'HH:mm:ss', new Date());
    return format(parsedTime, 'HH:mm');
};

const CartPage: React.FC = () => {
    const { cart, removeFromCart, clearCart, total } = useCart();

    const handlePurchase = async () => {
        try {
            const sessionsToUpdate = cart.reduce<{ sessionId: number; seats: { row: number; seat: number }[] }[]>((acc, session) => {
                const existing = acc.find((s) => s.sessionId === session.id);
                if (existing) {
                    existing.seats.push({ row: session.row!, seat: session.seat! });
                } else {
                    acc.push({
                        sessionId: session.id,
                        seats: [{ row: session.row!, seat: session.seat! }],
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

    return (
        <div className="container">
            <div className="row justify-content-center align-items-center vh-100">
                <div className="col-md-6 col-lg-4">
                    <h2 className="mb-4 text-center">Корзина</h2>
                    {cart.length > 0 ? (
                        <>
                            <ul className="list-unstyled mb-4">
                                {cart.map((session, index) => (
                                    <li key={index} className="mb-2 d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>Фильм:</strong> {session.title} <br/>
                                            <strong>Сеанс:</strong> {formatSessionTime(session.time)}{' '}
                                            <strong>Цена:</strong> {session.price} ₽{' '}
                                            {session.row !== undefined && session.seat !== undefined && (
                                                <span>
                        <strong>Место:</strong> {session.row} ряд, {session.seat} место
                    </span>
                                            )}
                                        </div>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => removeFromCart(session.id, session.row, session.seat)}
                                        >
                                            Удалить
                                        </Button>
                                    </li>
                                ))}
                            </ul>

                            <div className="mb-3 text-center">
                                <h5>Итоговая сумма: {total.toFixed(2)} ₽</h5>
                            </div>
                            <div className="d-flex justify-content-between">
                                <Button variant="danger" onClick={clearCart}>
                                    Удалить всё
                                </Button>
                                <Button variant="success" onClick={handlePurchase} disabled={cart.length === 0}>
                                    Оплатить
                                </Button>
                            </div>
                        </>
                    ) : (
                        <p className="text-center">Корзина пуста.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPage;
