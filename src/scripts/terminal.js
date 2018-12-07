import 'bootstrap';

import Swiper from 'swiper';

$( document ).ready(() => {
  console.log('log');

  Array.from(document.querySelectorAll('[data-carousel="swiper"]')).forEach(n => new Swiper(n, {
    loop: true,
    slidesPerView: 'auto',
    centeredSlides: false,
    initialSlide: 1,
    // autoplay: true,
    navigation: {
      prevEl: '.swiper-button-prev',
      nextEl: '.swiper-button-next',
    },
  }));

});
