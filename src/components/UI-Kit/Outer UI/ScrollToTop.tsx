import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';


const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Функция для прокрутки наверх
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Плавная прокрутка
        });
    };

    // Обработчик для отслеживания прокрутки
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <button
                    type="button"
                    className="btn btn-lg position-fixed bottom-0 end-0 m-3 p-2 "
                    onClick={scrollToTop}
                    style={{ fontSize: '3rem' }}
                >
                    <i className="bi bi-arrow-up-circle-fill    "></i>
                </button>
            )}
        </>
    );
};

export default ScrollToTop;
