document.addEventListener("DOMContentLoaded", async () => {
    const swiperWrapper = document.querySelector("#brands .swiper-wrapper");
    if (!swiperWrapper) {
      console.error("❌ عنصر swiper-wrapper در بخش برندها پیدا نشد.");
      return;
    }
  
    try {
      const res = await fetch(`${STRAPI_URL}/api/brands?populate=brand_image`);
      if (!res.ok) throw new Error(`خطای سرور: ${res.status}`);
      const json = await res.json();
      const brands = json?.data;
  
      if (!Array.isArray(brands) || brands.length === 0) {
        swiperWrapper.innerHTML = '<p class="text-warning text-center">برندی برای نمایش وجود ندارد.</p>';
        return;
      }
  
      const brandHTML = brands.map((brand) => {
        const imageUrl = brand.brand_image?.formats?.medium?.url || brand.brand_image?.url;
      
        const finalUrl = imageUrl ? `${STRAPI_URL}${imageUrl}` : "assets/img/brands/default.png";
      
        return `
          <div class="swiper-slide">
            <img src="${finalUrl}" alt="${brand.brand_name || 'لوگو'}" class="img-fluid brand-logo" />
          </div>
        `;
      }).join("");
      
  
      swiperWrapper.innerHTML = brandHTML;
  
      // راه‌اندازی Swiper (اگر تا الان راه‌اندازی نشده باشد)
      if (typeof Swiper !== "undefined") {
        new Swiper(".brands-slider", {
          loop: true,
          autoplay: {
            delay: 2000,
            disableOnInteraction: false
          },
          slidesPerView: 2,
          breakpoints: {
            576: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            992: { slidesPerView: 5 }
          }
        });
      }
  
    } catch (err) {
      console.error("❌ خطا در دریافت برندها:", err.message);
      swiperWrapper.innerHTML = '<p class="text-danger text-center">خطا در دریافت برندها.</p>';
    }
  });
  