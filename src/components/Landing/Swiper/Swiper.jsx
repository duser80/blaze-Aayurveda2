"use client"

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// import {} from 'swiper'
// import {} from 'swiper'
import './swiper.css'
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

 
export default function Swiper2() {
  return (
    <div className="container">
      <h1 className="heading">Flower Gallery</h1>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          clickable: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="swiper_container"
      >
        <SwiperSlide>
          <img style={{width:'344px',height:'344px',backgroundColor:'blue'}} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img style={{width:'344px',height:'344px',backgroundColor:'black'}} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img style={{width:'344px',height:'344px',backgroundColor:'blue'}} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img style={{width:'344px',height:'344px',backgroundColor:'blue'}} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img style={{width:'344px',height:'344px',backgroundColor:'blue'}} alt="slide_image" />
        </SwiperSlide>
         

        <div className="slider-controler">
          <div className="swiper-button-prev slider-arrow">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </div>
          <div className="swiper-button-next slider-arrow">
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
    </div>
  );
}
