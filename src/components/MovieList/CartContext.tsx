import React, { createContext, useContext, useState, ReactNode } from 'react';

type Session = {
    id: number;
    title: string; // Добавляем название фильма
    time: string;
    price: number;
    available_tickets: number;
    row?: number;
    seat?: number;
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

    // Рассчитываем общую сумму, суммируя все цены в корзине
    const total = cart.reduce((acc, session) => acc + session.price, 0);

    const addToCart = (session: Session) => {
        if (cart.length >= 5) {
            setError('Вы не можете добавить больше 5 сеансов в корзину.');
            return;
        }

        // Проверяем, существует ли уже такое место в корзине
        const isSeatAlreadyInCart = cart.some(
            (item) => item.id === session.id && item.row === session.row && item.seat === session.seat
        );

        if (isSeatAlreadyInCart) {
            setError('Это место уже выбрано.');
            return;
        }

        setCart((prevCart) => [...prevCart, session]);
        setError(null); // Сбрасываем ошибку, если добавление прошло успешно
    };

    const removeFromCart = (sessionId: number, row?: number, seat?: number) => {
        // Удаляем только то место, которое соответствует идентификатору, ряду и месту
        const updatedCart = cart.filter(
            (session) => !(session.id === sessionId && session.row === row && session.seat === seat)
        );
        setCart(updatedCart);
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
