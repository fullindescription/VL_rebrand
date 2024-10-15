import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './MovieCarousel.scss';

const MovieCarousel: React.FC = () => {
    return (
        <section className="movie-carousel">
            <Swiper
                modules={[Navigation, Pagination, FreeMode, Autoplay]}
                spaceBetween={10}
                slidesPerView={1} centeredSlides={true}
                navigation
                pagination={{ clickable: true, bulletClass: 'swiper-pagination-bullet custom-bullet' }}
                loop={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
            >
                <SwiperSlide>
                    <div className="movie-carousel__image" style={{ backgroundImage: 'url(/images/1.jpg)' }}></div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="movie-carousel__image" style={{ backgroundImage: 'url(/images/2.jpg)' }}></div>
                </SwiperSlide>
            </Swiper>
        </section>
    );
};

export default MovieCarousel;