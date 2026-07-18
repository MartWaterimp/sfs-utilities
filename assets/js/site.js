/* Shared UI helpers for Placidity's SFS Utilities */
(function () {
  function resolveModuleUrl(path) {
    return new URL(path, window.location.href).href;
  }

  async function loadModule(selector, modulePath) {
    const host = document.querySelector(selector);
    if (!host) return null;

    try {
      const response = await fetch(resolveModuleUrl(modulePath), { cache: "no-cache" });
      if (!response.ok) {
        throw new Error("Failed to load " + modulePath + " (" + response.status + ")");
      }
      const html = await response.text();
      host.outerHTML = html.trim();
      return true;
    } catch (error) {
      host.innerHTML =
        '<div class="empty-state">Could not load ' +
        modulePath +
        ". Serve the site over HTTP so modules can load.</div>";
      console.error(error);
      return false;
    }
  }

  function setActiveNav() {
    const page = document.body.dataset.page;
    if (!page) return;
    document.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.getAttribute("data-nav") === page) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
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

  async function boot() {
    await Promise.all([
      loadModule('[data-module="navbar"]', "modules/navbar.html"),
      loadModule('[data-module="footer"]', "modules/footer.html")
    ]);
    setActiveNav();
    document.dispatchEvent(new CustomEvent("sfs:modules-ready"));
  }

  window.SFSSite = {
    showToast: showToast,
    setActiveNav: setActiveNav,
    loadModule: loadModule
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
