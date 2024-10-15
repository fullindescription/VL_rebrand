import React from 'react';
import './MovieList.scss';

export const MovieList: React.FC = () => {
    const movieCards = Array(4).fill(null).map((_, index) => (
        <div key={index} className="movie-card">
            <div className="movie-card__image" style={{ backgroundImage: 'url(/images/1.jpg)' }}>
                <div className="movie-card__label">12+</div>
                <div className="movie-card__pushkin-card">Пушкинская карта</div>
                <div className="movie-card__advertisement">Реклама более 15 минут</div>
            </div>
            <div className="movie-card__info">
                <h3>Руки вверх!</h3>
                <p>музыкальный</p>
                <div className="movie-card__schedule">
                    {['10:30', '11:25', '12:15', '13:00', '13:45', '14:30', '15:15', '16:00', '16:45', '17:30'].slice(0, 6).map((time, i) => (
                        <div key={i} className="movie-card__time">
                            <p className="movie-card__time-hour">{time}</p>
                            <p className="movie-card__time-price">{i % 2 === 0 ? '350 ₽' : '360 ₽'}</p>
                            <p className="movie-card__time-type">{i % 2 === 0 ? 'Стандарт' : 'Комфорт'}</p>
                        </div>
                    ))}
                    {['10:30', '11:25', '12:15', '13:00', '13:45', '14:30', '15:15', '16:00', '16:45', '17:30'].length > 3 && (
                        <div className="movie-card__more">+{['10:30', '11:25', '12:15', '13:00', '13:45', '14:30', '15:15', '16:00', '16:45', '17:30'].length - 6}</div>
                    )}
                </div>
            </div>
        </div>
    ));

    return (
        <section className="movie-list">
            <h2>Афиша в городе Владивосток</h2>
            <div className="movie-list__grid">
                {movieCards.map((card, index) => (
                    <div key={index} className="movie-list__grid-item">
                        {card}
                    </div>
                ))}
            </div>
        </section>
    );
};