/* Shared UI helpers for Placidity's SFS Utilities */
(function () {
  function setActiveNav() {
    const page = document.body.dataset.page;
    if (!page) return;
    document.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.getAttribute("data-nav") === page) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function showToast(message) {
    let toast = document.getElementById("site-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "site-toast";
      toast.className = "toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  window.SFSSite = { showToast };
  document.addEventListener("DOMContentLoaded", setActiveNav);
})();
