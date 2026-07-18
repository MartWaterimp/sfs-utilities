/* Fuel calculator for Placidity's SFS Utilities */
(function () {
  const COOKIE_KEY = "placidity_sfs_fuels_v1";
  const COOKIE_DAYS = 400;

  const DEFAULT_FUELS = [
    {
      id: "hydrolox",
      name: "Hydrolox",
      description: "Liquid hydrogen with liquid oxygen. Light and efficient, but it takes up a lot of space.",
      oxidizer: 6.0,
      fuel: 1.0,
      density: 0.361,
      M: 0.1260,
      dryFraction: 0.12
    },
    {
      id: "methalox",
      name: "Methalox",
      description: "Liquid methane with liquid oxygen. A balanced option for most builds.",
      oxidizer: 3.6,
      fuel: 1.0,
      density: 0.833,
      M: 0.2908,
      dryFraction: 0.10
    },
    {
      id: "kerolox",
      name: "Kerolox",
      description: "Kerosene with liquid oxygen. Dense and compact, good when volume is tight.",
      oxidizer: 2.56,
      fuel: 1.0,
      density: 1.024,
      M: 0.3574,
      dryFraction: 0.09
    },
    {
      id: "hypergolic",
      name: "N2O4 / UDMH",
      description: "Storable hypergolics. Dense, reliable, and ready without deep cryogenics.",
      oxidizer: 2.6,
      fuel: 1.0,
      density: 1.173,
      M: 0.4095,
      dryFraction: 0.09
    }
  ];

  function cloneDefaults() {
    return DEFAULT_FUELS.map((fuel) => ({ ...fuel }));
  }

  function loadFuels() {
    const saved = window.CookieStore.getJSON(COOKIE_KEY, null);
    if (Array.isArray(saved) && saved.length) {
      return saved.map((fuel) => normalizeFuel(fuel));
    }
    return cloneDefaults();
  }

  function saveFuels(fuels) {
    window.CookieStore.setJSON(COOKIE_KEY, fuels, COOKIE_DAYS);
  }

  function normalizeFuel(fuel) {
    return {
      id: String(fuel.id || `custom-${Date.now()}`),
      name: String(fuel.name || "Untitled fuel").trim() || "Untitled fuel",
      description: String(fuel.description || "").trim(),
      oxidizer: toNumber(fuel.oxidizer, 1),
      fuel: toNumber(fuel.fuel, 1),
      density: toNumber(fuel.density, 1),
      M: toNumber(fuel.M, 0.3),
      dryFraction: Math.max(0, toNumber(fuel.dryFraction, 0.1))
    };
  }

  function toNumber(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function formatRatio(oxidizer, fuel) {
    const o = toNumber(oxidizer, NaN);
    const f = toNumber(fuel, NaN);
    if (!Number.isFinite(o) || !Number.isFinite(f) || f === 0) return "-";
    const clean = (n) => {
      const fixed = n.toFixed(2);
      return fixed.replace(/\.?0+$/, "");
    };
    return `${clean(o)}:${clean(f)}`;
  }

  function calcTank(width, height, fuel) {
    const density = toNumber(fuel.density, 0);
    const M = toNumber(fuel.M, 0);
    const dryFraction = Math.max(0, toNumber(fuel.dryFraction, 0));
    const k = width * M;
    const bpHeight = height * k;
    const bpY = k > 0 ? 1 / k : 0;
    const volume = Math.PI * Math.pow(width / 2, 2) * height;
    const propellantMass = volume * density;
    const dryMass = propellantMass * dryFraction;
    const totalMass = propellantMass + dryMass;
    return { k, bpHeight, bpY, volume, propellantMass, dryMass, totalMass };
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '\x26amp;')
      .replace(/</g, '\x26lt;')
      .replace(/>/g, '\x26gt;')
      .replace(/"/g, '\x26quot;')
      .replace(/'/g, '&#39;');
  }

  function init() {
    const widthInput = document.getElementById("tank-width");
    const heightInput = document.getElementById("tank-height");
    const fuelGrid = document.getElementById("fuel-grid");
    const overviewList = document.getElementById("dry-overview");
    const emptyState = document.getElementById("fuel-empty");
    const addBtn = document.getElementById("add-fuel-btn");
    const resetBtn = document.getElementById("reset-fuels-btn");
    const dialog = document.getElementById("fuel-dialog");
    const dialogTitle = document.getElementById("fuel-dialog-title");
    const form = document.getElementById("fuel-form");
    const cancelBtn = document.getElementById("fuel-cancel-btn");
    const saveBtn = document.getElementById("fuel-save-btn");

    if (!widthInput || !heightInput || !fuelGrid || !overviewList) return;

    let fuels = loadFuels();
    let editingId = null;

    function getSize() {
      return {
        width: Math.max(0, toNumber(widthInput.value, 0)),
        height: Math.max(0, toNumber(heightInput.value, 0))
      };
    }

    function openDialog(fuel) {
      editingId = fuel ? fuel.id : null;
      dialogTitle.textContent = fuel ? `Edit ${fuel.name}` : "Add a new fuel";
      form.name.value = fuel ? fuel.name : "";
      form.description.value = fuel ? fuel.description : "";
      form.oxidizer.value = fuel ? fuel.oxidizer : 2.5;
      form.fuel.value = fuel ? fuel.fuel : 1;
      form.density.value = fuel ? fuel.density : 1;
      form.M.value = fuel ? fuel.M : 0.35;
      form.dryFraction.value = fuel ? fuel.dryFraction : 0.1;
      updateRatioPreview();
      dialog.classList.add("open");
      dialog.setAttribute("aria-hidden", "false");
      form.name.focus();
    }

    function closeDialog() {
      dialog.classList.remove("open");
      dialog.setAttribute("aria-hidden", "true");
      editingId = null;
    }

    function updateRatioPreview() {
      const preview = document.getElementById("ratio-preview");
      if (!preview) return;
      preview.textContent = formatRatio(form.oxidizer.value, form.fuel.value);
    }

    function render() {
      const { width, height } = getSize();
      saveFuels(fuels);

      if (!fuels.length) {
        fuelGrid.innerHTML = "";
        emptyState.hidden = false;
        overviewList.innerHTML = `<div class="empty-state">No fuels to compare yet.</div>`;
        return;
      }

      emptyState.hidden = true;
      fuelGrid.innerHTML = fuels.map((fuel) => {
        const stats = calcTank(width, height, fuel);
        const ratio = formatRatio(fuel.oxidizer, fuel.fuel);
        return `
          <article class="card fuel-card" data-id="${escapeHtml(fuel.id)}">
            <div class="toolbar" style="margin-bottom: 8px;">
              <div>
                <h3>${escapeHtml(fuel.name)}</h3>
                <p class="muted">${escapeHtml(fuel.description || "Custom propellant mix.")}</p>
              </div>
              <span class="chip primary">${escapeHtml(ratio)} O:F</span>
            </div>
            <div class="chip-row">
              <span class="chip outline">Density ${toNumber(fuel.density, 0).toFixed(3)} t/m3</span>
              <span class="chip outline">M ${toNumber(fuel.M, 0).toFixed(4)}</span>
              <span class="chip outline">Dry fraction ${(toNumber(fuel.dryFraction, 0) * 100).toFixed(1)}%</span>
            </div>
            <hr class="divider" />
            <p class="section-copy" style="margin-bottom: 8px;"><strong>Mass breakdown</strong></p>
            <div class="stat-list">
              <div class="stat-row"><span>Propellant (wet)</span><strong>${stats.propellantMass.toFixed(3)} t</strong></div>
              <div class="stat-row"><span>Dry mass (structure)</span><strong>${stats.dryMass.toFixed(3)} t</strong></div>
              <div class="stat-row total"><span>Total mass</span><strong>${stats.totalMass.toFixed(3)} t</strong></div>
              <div class="stat-row muted"><span>Tank volume</span><span>${stats.volume.toFixed(3)} m3</span></div>
            </div>
            <hr class="divider" />
            <p class="section-copy" style="margin-bottom: 8px;"><strong>Blueprint values for SFS</strong></p>
            <div class="stat-list mono">
              <div class="stat-row"><span>width_original</span><span>${width.toFixed(4)}</span></div>
              <div class="stat-row"><span>height</span><span>${stats.bpHeight.toFixed(5)}</span></div>
              <div class="stat-row"><span>y</span><span>${stats.bpY.toFixed(6)}</span></div>
            </div>
            <div class="button-row" style="margin-top: 16px;">
              <button type="button" class="btn btn-outlined edit-fuel">Edit fuel</button>
              <button type="button" class="btn btn-text danger remove-fuel">Remove</button>
            </div>
          </article>
        `;
      }).join("");

      overviewList.innerHTML = fuels.map((fuel) => {
        const stats = calcTank(width, height, fuel);
        return `
          <div class="overview-row">
            <strong>${escapeHtml(fuel.name)}</strong>
            <span>Dry ${stats.dryMass.toFixed(3)} t · Propellant ${stats.propellantMass.toFixed(3)} t · Total ${stats.totalMass.toFixed(3)} t</span>
          </div>
        `;
      }).join("");
    }

    fuelGrid.addEventListener("click", (event) => {
      const card = event.target.closest(".fuel-card");
      if (!card) return;
      const id = card.getAttribute("data-id");
      const fuel = fuels.find((item) => item.id === id);
      if (!fuel) return;

      if (event.target.closest(".edit-fuel")) {
        openDialog(fuel);
      }

      if (event.target.closest(".remove-fuel")) {
        fuels = fuels.filter((item) => item.id !== id);
        render();
        window.SFSSite.showToast(`${fuel.name} removed`);
      }
    });

    widthInput.addEventListener("input", render);
    heightInput.addEventListener("input", render);
    addBtn.addEventListener("click", () => openDialog(null));
    resetBtn.addEventListener("click", () => {
      fuels = cloneDefaults();
      render();
      window.SFSSite.showToast("Default fuels restored");
    });
    cancelBtn.addEventListener("click", closeDialog);
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog();
    });
    form.oxidizer.addEventListener("input", updateRatioPreview);
    form.fuel.addEventListener("input", updateRatioPreview);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const draft = normalizeFuel({
        id: editingId || `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: form.name.value,
        description: form.description.value,
        oxidizer: form.oxidizer.value,
        fuel: form.fuel.value,
        density: form.density.value,
        M: form.M.value,
        dryFraction: form.dryFraction.value
      });

      if (!draft.name) {
        window.SFSSite.showToast("Give the fuel a name first");
        return;
      }

      if (editingId) {
        fuels = fuels.map((item) => (item.id === editingId ? draft : item));
        window.SFSSite.showToast(`${draft.name} updated`);
      } else {
        fuels = [...fuels, draft];
        window.SFSSite.showToast(`${draft.name} added`);
      }

      closeDialog();
      render();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && dialog.classList.contains("open")) {
        closeDialog();
      }
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
