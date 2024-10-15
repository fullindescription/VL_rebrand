import React from 'react';
import './Header.scss';

type HeaderProps = {
    title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="header">
            <div className="header__title-container">
                <h1 className="header__title">{title}</h1>
            </div>
            <nav className="header__nav">
                <ul>
                    <li>Сегодня</li>
                    <li>Завтра</li>
                    <li>Фильмы iMax</li>
                    <li>Скоро</li>
                    <li>Календарь</li>
                    <li>Пушкинская Карта</li>
                    <li>Календарь</li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;