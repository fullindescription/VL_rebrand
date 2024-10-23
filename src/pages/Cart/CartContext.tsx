// Обновленный тип Session&SeatSelection с количеством билетов
import {createContext, ReactNode, useContext, useState} from "react";

type Session = {
    id: number;
    title: string; // Название фильма или события
    time: string;
    price: number;
    available_tickets: number;
    row?: number;
    seat?: number;
    quantity: number; // Количество одинаковых билетов
};

type CartContextType = {
    cart: Session[];
    addToCart: (session: Session) => void;
    removeFromCart: (sessionId: number, row?: number, seat?: number) => void;
    clearCart: () => void;
    setError: (message: string | null) => void;
    error: string | null;
    total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Session[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Рассчитываем общую сумму
    const total = cart.reduce((acc, session) => acc + session.price * session.quantity, 0);

    const addToCart = (session: Omit<Session, 'quantity'> & { quantity: number }) => {
        // Проверяем, существует ли уже такой сеанс в корзине
        const existingSessionIndex = cart.findIndex(
            (item) =>
                item.id === session.id &&
                item.time === session.time &&
                (item.row === session.row || item.row === undefined) &&
                (item.seat === session.seat || item.seat === undefined)
        );

        if (existingSessionIndex !== -1) {
            // Если сеанс уже есть, увеличиваем количество
            const updatedCart = [...cart];
            updatedCart[existingSessionIndex].quantity += session.quantity; // Добавляем указанное количество
            setCart(updatedCart);
        } else {
            // Если сеанс новый, добавляем его в корзину с указанным количеством
            setCart((prevCart) => [...prevCart, { ...session }]);
        }

        setError(null); // Сбрасываем ошибку, если добавление прошло успешно
    };

    const removeFromCart = (sessionId: number, row?: number, seat?: number) => {
        setCart((prevCart) =>
            prevCart
                .map((session) => {
                    if (session.id === sessionId && session.row === row && session.seat === seat) {
                        return { ...session, quantity: session.quantity - 1 };
                    }
                    return session;
                })
                .filter((session) => session.quantity > 0)
        );
        setError(null);
    };

    const clearCart = () => {
        setCart([]);
        setError(null);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, setError, error, total }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
