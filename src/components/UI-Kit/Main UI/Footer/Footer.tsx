import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer: React.FC = () => {
    return (
        <footer className="bg-secondary-subtle text-dark py-5">
            <div className="container">
                <div className="row">
                    {/* Первый раздел */}
                    <div className="col-md-4 mb-4">
                        <h5 className="fw-bold">Разделы</h5>
                        <ul className="list-unstyled">
                            <li>Кинотеатры</li>
                            <li>Скоро на экранах</li>
                            <li>Рецензии</li>
                            <li>Архив фильмов</li>
                        </ul>
                    </div>

                    {/* Второй раздел */}
                    <div className="col-md-4 mb-4">
                        <h5 className="fw-bold">Смотрите также</h5>
                        <ul className="list-unstyled">
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

                    {/* Третий раздел */}
                    <div className="col-md-4 mb-4">
                        <h5 className="fw-bold">Информация</h5>
                        <ul className="list-unstyled">
                            <li>Вакансии</li>
                            <li>Контакты</li>
                        </ul>
                        <p>
                            По вопросам, предложениям или ошибкам пишите на почту <a href="mailto:bilet@vl.ru">bilet@vl.ru</a>
                        </p>
                        <p className="text-muted small">
                            © ООО "Примнет". При любом использовании материалов ссылка на KINO.VL.ru обязательна. Цитирование в Интернете возможно только при наличии гиперссылки. Все права защищены.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
