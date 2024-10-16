
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.scss';

type HeaderProps = {
    title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="header">
            <div className="header__title-container">
                <Link to="/" className="header__title-link">
                    <h1 className="header__title">{title}</h1>
                </Link>
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
            <div className="header__auth-buttons">
                <Link to="/login" className="header__login-button">Вход</Link>
            </div>
        </header>
    );
};

export default Header;