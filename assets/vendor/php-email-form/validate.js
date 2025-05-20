(function () {
    "use strict";
  
    const forms = document.querySelectorAll('.php-email-form');
  
    forms.forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
  
        const loading = form.querySelector('.loading');
        const submitButton = form.querySelector("button[type='submit']");
        show(loading);
        submitButton.disabled = true;
  
        const payload = collectFormData(form);
        const strapiEndpoint = `${STRAPI_URL}/api/leads`;
  
        fetch(strapiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: payload })
        })
          .then(async (response) => {
            let resJson = {};
            try {
              resJson = await response.json();
            } catch (e) {}
  
            if (!response.ok) {
              const msg = resJson?.error?.message || 'ارسال با خطا مواجه شد.';
              throw new Error(msg);
            }
  
            showToast("پیام شما با موفقیت ارسال شد.", "success");
            form.reset();
          })
          .catch((err) => {
            showToast(err.message || "خطا در ارسال فرم.", "danger");
          })
          .finally(() => {
            hide(loading);
            submitButton.disabled = false;
          });
      });
    });
  
    function collectFormData(form) {
      const data = {};
      form.querySelectorAll('input, textarea').forEach((el) => {
        if (el.name) {
          data[el.name] = el.type === 'number' ? Number(el.value.trim()) : el.value.trim();
        }
      });
      return data;
    }
  
    function show(el) {
      if (el) el.classList.add('d-block');
    }
  
    function hide(el) {
      if (el) el.classList.remove('d-block');
    }
  
    function showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `toast text-bg-${type} border-0 toast-animate-in`;
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.width = 'auto';
        toast.style.maxWidth = '300px';
        toast.style.padding = '12px 16px';
        toast.style.backgroundColor = type === 'danger' ? '#dc3545' : '#198754';
        toast.style.color = '#fff';
        toast.style.fontSize = '0.95rem';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
        toast.style.zIndex = '9999';
        toast.style.opacity = '1';
        toast.style.display = 'block';
        toast.style.direction = 'rtl';
        toast.style.textDecoration = 'none';
      
        toast.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; text-decoration: none;">
            <div style="text-decoration: none;">${message}</div>
            <button onclick="this.closest('.toast').remove()" style="background:none;border:none;color:#fff;font-size:1.2rem;line-height:1;text-decoration:none;">×</button>
          </div>
        `;
      
        document.body.appendChild(toast);
      
        setTimeout(() => {
          toast.classList.remove("toast-animate-in");
          toast.classList.add("toast-animate-out");
      
          setTimeout(() => {
            toast.remove();
          }, 400);
        }, 5000);
      }
      
  })();
  