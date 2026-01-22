(() => {
  const forms = document.querySelectorAll(".js-google-form");

  if (!forms.length) {
    return;
  }

  const serialize = (form) => {
    const formData = new FormData(form);
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      params.append(key, String(value));
    });
    return params.toString();
  };

  forms.forEach((form) => {
    const status = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector("button[type=\"submit\"]");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (form.dataset.submitting === "true") {
        return;
      }

      form.dataset.submitting = "true";
      if (status) {
        status.hidden = true;
        status.classList.remove("is-success", "is-error");
      }
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
      }

      const originalAction = form.action;
      const proxyUrl = `/api/submit-form?destination=${encodeURIComponent(originalAction)}`;

      fetch(proxyUrl, {
        method: "POST",
        headers: {
          // 'Content-Type' is not set manually for FormData to let browser set boundary
        },
        body: new FormData(form),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Form submission failed");
          }
          if (status) {
            status.textContent =
              status.dataset.success || "Thanks! Your details were sent.";
            status.classList.add("is-success");
            status.hidden = false;
          }
          form.reset();
        })
        .catch(() => {
          if (status) {
            status.textContent =
              status.dataset.error ||
              "Something went wrong. Please try again.";
            status.classList.add("is-error");
            status.hidden = false;
          }
        })
        .finally(() => {
          delete form.dataset.submitting;
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.removeAttribute("aria-busy");
          }
        });
    });
  });
})();
