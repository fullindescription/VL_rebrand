import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';  // Не забудьте подключить JS для работы карусели
import './MovieCarousel.css';  // Добавляем файл стилей для кастомизации индикаторов

const MovieCarousel: React.FC = () => {
    return (
        <div className="container-fluid p-0">
            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0"
                            className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                            aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                            aria-label="Slide 3"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3"
                            aria-label="Slide 4"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4"
                            aria-label="Slide 5"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="/images/1.jpg" className="d-block w-100 img-fluid rounded"
                             style={{height: '360px', objectFit: 'cover'}} alt="Первый слайд"/>
                    </div>
                    <div className="carousel-item">
                        <img src="/images/2.jpg" className="d-block w-100 img-fluid rounded"
                             style={{height: '360px', objectFit: 'cover'}} alt="Второй слайд"/>
                    </div>
                    <div className="carousel-item">
                        <img src="/images/3.jpg" className="d-block w-100 img-fluid rounded"
                             style={{height: '360px', objectFit: 'cover'}} alt="Третий слайд"/>
                    </div>
                    <div className="carousel-item">
                        <img src="/images/4.jpg" className="d-block w-100 img-fluid rounded"
                             style={{height: '360px', objectFit: 'cover'}} alt="Четвёртый слайд"/>
                    </div>
                    <div className="carousel-item">
                        <img src="/images/5.jpg" className="d-block w-100 img-fluid rounded"
                             style={{height: '360px', objectFit: 'cover'}} alt="Пятый слайд"/>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
                        data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
                        data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
};

export default MovieCarousel;
