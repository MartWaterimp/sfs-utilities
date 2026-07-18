/* Cookie helpers for Placidity's SFS Utilities */
(function (global) {
  const CookieStore = {
    set(name, value, days = 365) {
      const maxAge = Math.max(1, Math.floor(days * 24 * 60 * 60));
      const encoded = encodeURIComponent(value);
      document.cookie = `${encodeURIComponent(name)}=${encoded}; path=/; max-age=${maxAge}; SameSite=Lax`;
    },

    get(name) {
      const key = encodeURIComponent(name) + "=";
      const parts = document.cookie ? document.cookie.split("; ") : [];
      for (const part of parts) {
        if (part.indexOf(key) === 0) {
          return decodeURIComponent(part.slice(key.length));
        }
      }
      return null;
    },

    remove(name) {
      document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; SameSite=Lax`;
    },

    setJSON(name, data, days = 365) {
      this.set(name, JSON.stringify(data), days);
    },

    getJSON(name, fallback = null) {
      const raw = this.get(name);
      if (raw == null || raw === "") return fallback;
      try {
        return JSON.parse(raw);
      } catch (err) {
        return fallback;
      }
    }
  };

  global.CookieStore = CookieStore;
})(window);
