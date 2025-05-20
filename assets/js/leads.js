document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("leads");
  if (!form) return;

  const loading = form.querySelector(".loading");
  const errorMessage = form.querySelector(".error-message");
  const successMessage = form.querySelector(".sent-message");
  const submitButton = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.querySelector("input[name='name']").value.trim();
    const family_name = form.querySelector("input[name='family_name']").value.trim();
    const email = form.querySelector("input[name='email']").value.trim();
    const company = form.querySelector("input[name='company']").value.trim();
    const number_of_employees = form.querySelector("input[name='number_of_employees']").value.trim();
    const massage = form.querySelector("textarea[name='massage']").value.trim();

    if (!validateEmail(email)) {
      return showMessage(errorMessage, "لطفاً ایمیل معتبر وارد کنید.");
    }

    if (number_of_employees && (isNaN(number_of_employees) || Number(number_of_employees) < 0)) {
      return showMessage(errorMessage, "تعداد کارکنان باید یک عدد معتبر باشد.");
    }

    toggleState("loading");

    const payload = {
      data: {
        name,
        family_name,
        email,
        company,
        number_of_employees: Number(number_of_employees),
        massage,
      },
    };

    try {
      const res = await fetch(`${STRAPI_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = resData.error?.message || "ارسال فرم با خطا مواجه شد.";
        return showMessage(errorMessage, msg);
      }

      showMessage(successMessage, "پیام شما با موفقیت ارسال شد.");
      form.reset();

    } catch (err) {
      showMessage(errorMessage, "خطا در ارتباط با سرور.");
    } finally {
      toggleState("idle");
    }
  });

  // 📌 توابع کمکی

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showMessage(el, msg) {
    hideMessage(errorMessage);
    hideMessage(successMessage);
    el.textContent = msg;
    el.classList.add("d-block");
  }

  function hideMessage(el) {
    el.textContent = "";
    el.classList.remove("d-block");
  }

  function toggleState(state) {
    if (state === "loading") {
      loading.classList.add("d-block");
      hideMessage(errorMessage);
      hideMessage(successMessage);
      submitButton.disabled = true;
    } else {
      loading.classList.remove("d-block");
      submitButton.disabled = false;
    }
  }
});
