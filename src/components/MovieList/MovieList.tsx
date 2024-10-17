import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MovieList.scss'

export const MovieList: React.FC = () => {
    const movieCards = Array(4).fill(null).map((_, index) => (
        <div
            key={index}
            className="card bg-dark text-white h-100 d-flex flex-row movie-card p-3"
            style={{ transition: 'transform 0.3s ease-in-out' }} /* Плавная анимация */
        >
            {/* Левая часть - изображение */}
            <div className="position-relative me-3" style={{
                backgroundImage: 'url(/images/1.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '450px',
                height: '400px',
                borderRadius: '10px'
            }}>
                <div className="position-absolute top-0 start-0 m-2 p-1 bg-danger text-white rounded">18+</div>
                <div className="position-absolute top-0 end-0 m-2 p-1 bg-success text-white rounded">Пушкинская карта</div>
                <div className="position-absolute bottom-0 start-0 m-2 p-1 bg-warning text-dark rounded">Реклама более 15 минут</div>
            </div>

            {/* Правая часть - информация */}
            <div className="card-body d-flex flex-column justify-content-between">
                <div>
                    <h3 className="card-title">Руки Вверх!</h3>
                    <p className="card-text">музыкальный</p>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-2">
                    {['11:25', '12:15', '13:00', '13:45', '14:45', '15:15'].map((time, i) => (
                        <div key={i} className="bg-secondary text-center text-white p-2 rounded" style={{ width: '100px', height: '100px' }}>
                            <p className="mb-1">{time}</p>
                            <p className="mb-1">{i % 2 === 0 ? '350 ₽' : '360 ₽'}</p>
                            <p className="mb-0">{i % 2 === 0 ? 'Стандарт' : 'Комфорт'}</p>
                        </div>
                    ))}
                    {['11:25', '12:15', '13:00', '13:45', '14:45', '15:15', '16:00', '17:30', '18:45', '19:30'].length > 6 && (
                        <div className="bg-secondary text-center text-white p-2 rounded" style={{ width: '60px' }}>
                            +{['11:25', '12:15', '13:00', '13:45', '14:45', '15:15', '16:00', '17:30', '18:45', '19:30'].length - 6}
                        </div>
                    )}
                </div>
            </div>
        </div>
    ));

    return (
        <section className="container mt-5 mb-5">
            <h2 className="text-center mb-4">Афиша в городе Владивосток</h2>
            <div className="row row-cols-1 row-cols-md-2 g-4"> {/* Две карточки по горизонтали на экранах md и выше */}
                {movieCards.map((card, index) => (
                    <div
                        key={index}
                        className="col"
                        style={{ transition: 'transform 0.3s ease-in-out' }}
                    > {/* Устанавливаем колонки */}
                        {card}
                    </div>
                ))}
            </div>
        </section>
    );
};
