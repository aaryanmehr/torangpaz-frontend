document.addEventListener("DOMContentLoaded", async () => {
  const menuTabsContainer = document.querySelector("#menu .nav-tabs");
  const menuTabContent = document.querySelector("#menu .tab-content");

  if (!menuTabsContainer || !menuTabContent) {
    console.error("❌ المان‌های تب منو پیدا نشدند.");
    return;
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/menu-sections?populate=menu_categories.menu_items.Image`);
    if (!res.ok) throw new Error(`خطای سرور: ${res.status}`);
    const json = await res.json();
    const sections = json?.data;

    if (!Array.isArray(sections) || sections.length === 0) {
      menuTabsContainer.innerHTML = '<p class="text-warning text-center">هیچ بخش منویی پیدا نشد.</p>';
      return;
    }

    const tabsHTML = [];
    const tabContentsHTML = [];

    sections.forEach((section, secIdx) => {
      const categories = section.menu_categories || [];
      if (!Array.isArray(categories) || categories.length === 0) return;

      categories.forEach((category, catIdx) => {
        const categoryId = `menu-cat-${secIdx}-${catIdx}`;
        const categoryName = category.title || `دسته ${catIdx + 1}`;
        const menuItems = category.menu_items || [];

        if (!menuItems.length) return;

        tabsHTML.push(`
          <li class="nav-item">
            <a class="nav-link ${tabsHTML.length === 0 ? "active show" : ""}" data-bs-toggle="tab" data-bs-target="#${categoryId}">
              <h4>${categoryName}</h4>
            </a>
          </li>
        `);

        const itemsHTML = menuItems.map((item, idx) => generateMenuItemHTML(item, idx)).join("");

        tabContentsHTML.push(`
          <div class="tab-pane fade ${tabContentsHTML.length === 0 ? "active show" : ""}" id="${categoryId}">
            <div class="tab-header text-center">
            
              <!-- <h3>${categoryName}</h3> -->
            </div>
            <div class="row gy-5">
              ${itemsHTML}
            </div>
          </div>
        `);
      });
    });

    if (!tabsHTML.length) {
      menuTabsContainer.innerHTML = '<p class="text-warning text-center">هیچ دسته‌ای برای منو وجود ندارد.</p>';
    } else {
      menuTabsContainer.innerHTML = tabsHTML.join("");
      menuTabContent.innerHTML = tabContentsHTML.join("");
       if (typeof mixpanel !== "undefined") {
        mixpanel.track("Visited Menu Section", {
          menuSectionsCount: sections.length,
          timestamp: new Date().toISOString()
        });
      } else {
        console.warn("📉 Mixpanel is not defined");
      }
    }
  } catch (err) {
    console.error("❌ خطا در دریافت منو:", err.message);
    menuTabContent.innerHTML = '<p class="text-danger text-center">خطا در دریافت منو.</p>';
  }
});

function generateMenuItemHTML(item, idx) {
  const title = item.Title || "بدون عنوان";
  const price = item.Price != null ? Number(item.Price).toLocaleString() + " تومان" : "قیمت نامشخص";
  const description = item.Description?.[0]?.children?.[0]?.text || "بدون توضیح";
  const imageUrl = item.Image?.formats?.medium?.url || item.Image?.url || "";
  const finalUrl = imageUrl ? STRAPI_URL + imageUrl : "assets/img/menu/default.jpg";

  return `
    <div class="col-lg-4 menu-item" data-aos="fade-up" data-aos-delay="${(idx + 1) * 100}">
      <a href="${finalUrl}" class="glightbox">
        <img src="${finalUrl}" class="menu-img img-fluid" alt="${title}">
      </a>
      <h4>${title}</h4>
      <!--
      <p class="ingredients">${description}</p>
      <p class="price">${price}</p>
      -->
    </div>
  `;
}
