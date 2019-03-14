import 'bootstrap';

import Swiper from 'swiper';

const Classes = {
  WINDOW_HOVER: 'jumbotron__window-link--hover'
}

$( document ).ready(() => {
  Array.from(document.querySelectorAll('#partners-carousel')).forEach(n => new Swiper(n, {
    loop: true,
    slidesPerView: 'auto',
    centeredSlides: false,
    initialSlide: 1,
    // autoplay: true,
    navigation: {
      prevEl: '.partners-button-prev',
      nextEl: '.partners-button-next',
    },
  }));

  const screenshots = new Swiper($('#screenshots-carousel'), {
    loop: false,
    slidesPerView: 1,
    initialSlide: 1,
    // autoplay: true,
    navigation: {
      prevEl: '.screenshots-button-prev',
      nextEl: '.screenshots-button-next',
    },
  });

  $('#modal').on('shown.bs.modal', function(e) {
    const item = $( e.relatedTarget ).data('carouselItem');

    screenshots.update();

    screenshots.slideTo(item, 500);

    return;
  });

  const carouselItems = $('data-carousel-item');

  setTimeout(() => {
    const toggleHoverClass = (boolean) => {
      return function() {
        boolean ? $( this ).addClass(Classes.WINDOW_HOVER) : $( this ).removeClass(Classes.WINDOW_HOVER);
      };
    }

    const $items = $('[data-carousel-item]');

    if(!$items.length) return;

    $items.one('mouseenter', toggleHoverClass(true));

    $items.one('mouseleave', function() {
      setTimeout(toggleHoverClass(false).bind(this), 150);
    });

    const [item, ...items] = Array.from($items);

    const rec = (cur, arr) => {
      $( cur ).trigger('mouseenter').trigger('mouseleave');

      if(!arr.length) return;

      const [first, ...rest] = arr;

      return setTimeout(() => rec(first, rest), 75);
    }

    rec(item, items);
  }, 1500);
});
