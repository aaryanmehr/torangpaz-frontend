document.addEventListener("DOMContentLoaded", () => {
  new Swiper(".brand-swiper", {
    slidesPerView: 5,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    breakpoints: {
      0: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      768: {
        slidesPerView: 5,
        spaceBetween: 30,
      }
    }
  });
});
