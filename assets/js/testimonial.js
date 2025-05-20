document.addEventListener("DOMContentLoaded", () => {
    initTestimonials();
  });
  
  async function initTestimonials() {
    const container = document.getElementById("testimonial-container");
    if (!container) return;
  
    const url = `${STRAPI_URL}/api/testimonials?populate=avatar`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  
      const data = await response.json();
      const testimonials = data?.data || [];
  
      if (testimonials.length === 0) {
        container.innerHTML = `<p class="text-center">هیچ نظری ثبت نشده است.</p>`;
        return;
      }
  
      const slidesHTML = testimonials.map(createTestimonialSlide).join("");
      const shouldLoop = testimonials.length >= 3;
  
      // حذف Swiper قبلی (در صورت وجود)
      if (window.testimonialSwiper?.destroy instanceof Function) {
        window.testimonialSwiper.destroy(true, true);
      }
  
      // درج DOM
      container.innerHTML = `
        <div class="swiper testimonial-swiper">
          <div class="swiper-wrapper">
            ${slidesHTML}
          </div>
          <div class="swiper-pagination testimonial-pagination"></div>
        </div>
      `;
  
      // مقداردهی Swiper خاص این بخش
      requestAnimationFrame(() => {
        window.testimonialSwiper = new Swiper(".testimonial-swiper", {
          loop: shouldLoop,
          speed: 600,
          autoplay: { delay: 5000 },
          slidesPerView: 1,
          pagination: {
            el: ".testimonial-pagination",
            type: "bullets",
            clickable: true
          }
        });
      });
  
    } catch (err) {
      console.error("❌ خطا در دریافت نظرات:", err);
      container.innerHTML = `<p class="text-danger text-center">خطا در بارگذاری نظرات. لطفاً بعداً امتحان کنید.</p>`;
    }
  }
  
  function createTestimonialSlide(item) {
    const {
      text = [],
      customer_name = "نام ناشناس",
      job_title = "بدون عنوان شغلی",
      avatar
    } = item;
  
    const comment = sanitizeText(text?.[0]?.children?.[0]?.text || "بدون متن نظر");
    const imgUrl = avatar?.formats?.medium?.url || avatar?.formats?.small?.url;
    const fullImageUrl = imgUrl ? STRAPI_URL + imgUrl : "assets/img/testimonials/default.jpg";
  
    return `
      <div class="swiper-slide">
        <div class="testimonial-item">
          <div class="row gy-4 justify-content-center">
            <div class="col-lg-6">
              <div class="testimonial-content">
                <p>
                  
                  <span>${comment}</span>
                 
                </p>
                <h3>${customer_name}</h3>
                <h4>${job_title}</h4>

              </div>
            </div>
            <div class="col-lg-2 text-center">
              <img src="${fullImageUrl}" class="img-fluid testimonial-img" alt="${customer_name}">
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  function sanitizeText(str) {
    return str?.replace(/[&<>"']/g, function (m) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[m];
    }) || '';
  }
  