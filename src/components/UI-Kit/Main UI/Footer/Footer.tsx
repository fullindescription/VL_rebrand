import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer: React.FC = () => {
    return (
        <footer
            className="text-white py-5"
            style={{
                backgroundColor: 'rgba(180, 113, 86, 0.75)', // Прозрачный фон на 75%
            }}
        >
            <div className="container">
                <div className="row">
                    {/* Первый раздел */}
                    <div className="col-md-4 mb-4">
                        <h5 className="fw-bold">Разделы</h5>
                        <ul className="list-unstyled">
                            <li><a href="/cinemas" className="text-white text-decoration-none">Кинотеатры</a></li>
                            <li><a href="/premiere" className="text-white text-decoration-none">Скоро на экранах</a></li>
                            <li><a href="/reviews" className="text-white text-decoration-none">Рецензии</a></li>
                            <li><a href="/archive" className="text-white text-decoration-none">Архив фильмов</a></li>
                        </ul>
                    </div>

                    {/* Второй раздел */}
                    <div className="col-md-4 mb-4">
                        <h5 className="fw-bold">Смотрите также</h5>
                        <ul className="list-unstyled">
                            <li><a href="/auto" className="text-white text-decoration-none">Авто</a></li>
                            <li><a href="/home" className="text-white text-decoration-none">Афиша</a></li>
                            <li><a href="/movies" className="text-white text-decoration-none">Кино</a></li>
                            <li><a href="/real-estate" className="text-white text-decoration-none">Недвижимость</a></li>
                            <li><a href="/news" className="text-white text-decoration-none">Новости</a></li>
                            <li><a href="/ads" className="text-white text-decoration-none">Объявления</a></li>
                            <li><a href="/jobs" className="text-white text-decoration-none">Работа</a></li>
                            <li><a href="/companies-directory" className="text-white text-decoration-none">Справочник компаний</a></li>
                        </ul>
                    </div>

                    {/* Третий раздел */}
                    <div className="col-md-4 mb-4">
                        <h5 className="fw-bold">Информация</h5>
                        <ul className="list-unstyled">
                            <li><a href="/vacancies" className="text-white text-decoration-none">Вакансии</a></li>
                            <li><a href="/contacts" className="text-white text-decoration-none">Контакты</a></li>
                        </ul>
                        <p>
                            По вопросам, предложениям или ошибкам пишите на почту <a href="mailto:bilet@vl.ru" className="text-white">bilet@vl.ru</a>
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
