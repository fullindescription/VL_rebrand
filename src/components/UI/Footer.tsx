import React from 'react';
import './Footer.scss';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__section">
                    <h4>Разделы</h4>
                    <ul>
                        <li>Кинотеатры</li>
                        <li>Скоро на экранах</li>
                        <li>Рецензии</li>
                        <li>Архив фильмов</li>
                    </ul>
                </div>
                <div className="footer__section">
                    <h4>Смотрите также</h4>
                    <ul>
                        <li>Авто</li>
                        <li>Афиша</li>
                        <li>Кино</li>
                        <li>Недвижимость</li>
                        <li>Новости</li>
                        <li>Объявления</li>
                        <li>Работа</li>
                        <li>Справочник компаний</li>
                    </ul>
                </div>
                <div className="footer__section">
                    <h4>Информация</h4>
                    <ul>
                        <li>Вакансии</li>
                        <li>Контакты</li>
                    </ul>
                    <p>По вопросам, предложениям или ошибкам пишите на почту <a href="mailto:bilet@vl.ru">bilet@vl.ru</a></p>
                    <p>© ООО "Примнет" При любом использовании материалов ссылка на KINO.VL.ru обязательна. Цитирование в Интернете возможно только при наличии гиперссылки. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;