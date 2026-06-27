/* Manual Hunter — builds pre-filtered search links into nationwide car marketplaces. */

// Each model carries the identifiers different marketplaces expect.
const MODELS = [
  {
    id: "prelude",
    emoji: "🚗",
    name: "Honda Prelude",
    sub: "Honda • 5th gen (1997–2001)",
    q: "honda prelude",
    make: "honda",
    atModel: "prelude",        // AutoTrader / AutoTempest model slug
    carsModel: "honda-prelude", // Cars.com model slug
    bat: "honda/prelude",      // Bring a Trailer path
    cb: "honda-prelude",       // Cars & Bids slug
    yearMin: 1997,
    yearMax: 2001,
    manualBadge: "5-speed manual all years (Type SH was manual-only)",
  },
  {
    id: "240sx",
    emoji: "🏎️",
    name: "Nissan 240SX",
    sub: "Nissan • S14 (1996–1998)",
    q: "nissan 240sx",
    make: "nissan",
    atModel: "240sx",
    carsModel: "nissan-240sx",
    bat: "nissan/240sx",
    cb: "nissan-240sx",
    yearMin: 1996,
    yearMax: 1998,
    manualBadge: "5-speed manual all years",
  },
  {
    id: "is300",
    emoji: "🚘",
    name: "Lexus IS300",
    sub: "Lexus • 1st gen (2001–2005)",
    q: "lexus is300",
    make: "lexus",
    atModel: "is-300",
    carsModel: "lexus-is_300",
    bat: "lexus/is300",
    cb: "lexus-is300",
    yearMin: 2001,
    yearMax: 2005,
    // 5-speed manual wasn't offered until 2002 (US launch in 2001 was automatic-only).
    manualYearMin: 2002,
    manualBadge: "manual only 2002–2005 (2001 was auto-only)",
  },
];

const enc = encodeURIComponent;

// Effective year range for a model: tighten to manual-only years when filtering for manuals.
function yearRange(m, f) {
  const min = f.manualOnly && m.manualYearMin ? m.manualYearMin : m.yearMin;
  const max = f.manualOnly && m.manualYearMax ? m.manualYearMax : m.yearMax;
  return { min, max };
}

// Marketplace link builders. Each returns a ready-to-open URL for one model + filters.
const SITES = [
  {
    key: "autotempest",
    label: "AutoTempest",
    emoji: "🧭",
    note: "aggregates Cars.com, Craigslist, eBay, CarGurus & more",
    build: (m, f) => {
      const p = new URLSearchParams({ make: m.make, model: m.atModel });
      if (f.manualOnly) p.set("transmission", "manual");
      const ay = yearRange(m, f);
      if (ay.min) p.set("minyear", ay.min);
      if (ay.max) p.set("maxyear", ay.max);
      if (f.maxPrice) p.set("maxprice", f.maxPrice);
      if (f.zip) p.set("zip", f.zip);
      if (f.radius && f.radius !== "0") p.set("radius", f.radius);
      return `https://www.autotempest.com/results?${p}`;
    },
  },
  {
    key: "cars",
    label: "Cars.com",
    emoji: "🅲",
    build: (m, f) => {
      const p = new URLSearchParams();
      p.set("stock_type", "all");
      p.append("makes[]", m.make);
      p.append("models[]", m.carsModel);
      if (f.manualOnly) p.append("transmission_slugs[]", "manual");
      const cy = yearRange(m, f);
      if (cy.min) p.set("year_min", cy.min);
      if (cy.max) p.set("year_max", cy.max);
      if (f.maxPrice) p.set("maximum_price", f.maxPrice);
      p.set("maximum_distance", f.radius && f.radius !== "0" ? f.radius : "all");
      if (f.zip) p.set("zip", f.zip);
      return `https://www.cars.com/shopping/results/?${p}`;
    },
  },
  {
    key: "autotrader",
    label: "AutoTrader",
    emoji: "🅰️",
    build: (m, f) => {
      const p = new URLSearchParams();
      if (f.manualOnly) p.set("transmissionCodes", "MAN");
      const ty = yearRange(m, f);
      if (ty.min) p.set("startYear", ty.min);
      if (ty.max) p.set("endYear", ty.max);
      if (f.maxPrice) p.set("maxPrice", f.maxPrice);
      if (f.zip) p.set("zip", f.zip);
      p.set("searchRadius", f.radius || "0"); // 0 = nationwide
      return `https://www.autotrader.com/cars-for-sale/${m.make}/${m.atModel}?${p}`;
    },
  },
  {
    key: "ebay",
    label: "eBay Motors",
    emoji: "🛒",
    build: (m, f) => {
      const kw = f.manualOnly ? `${m.q} manual` : m.q;
      const p = new URLSearchParams({ _nkw: kw, _sop: "10" }); // sort: newly listed
      if (f.maxPrice) p.set("_udhi", f.maxPrice);
      return `https://www.ebay.com/sch/6001/i.html?${p}`; // 6001 = Cars & Trucks
    },
  },
  {
    key: "craigslist",
    label: "Craigslist",
    emoji: "📋",
    note: "nationwide via Google",
    build: (m, f) => {
      const kw = f.manualOnly ? `${m.q} manual transmission` : m.q;
      return `https://www.google.com/search?q=${enc(`site:craigslist.org ${kw}`)}`;
    },
  },
  {
    key: "facebook",
    label: "Facebook Marketplace",
    emoji: "📘",
    build: (m, f) => {
      const kw = f.manualOnly ? `${m.q} manual` : m.q;
      return `https://www.facebook.com/marketplace/search/?query=${enc(kw)}`;
    },
  },
  {
    key: "cargurus",
    label: "CarGurus",
    emoji: "🦍",
    note: "via Google",
    build: (m, f) => {
      const kw = f.manualOnly ? `${m.q} manual` : m.q;
      return `https://www.google.com/search?q=${enc(`site:cargurus.com ${kw}`)}`;
    },
  },
  {
    key: "bat",
    label: "Bring a Trailer",
    emoji: "🏆",
    build: (m) => `https://bringatrailer.com/${m.bat}/`,
  },
  {
    key: "carsandbids",
    label: "Cars & Bids",
    emoji: "🔨",
    build: (m) => `https://carsandbids.com/search/${m.cb}`,
  },
  {
    key: "hemmings",
    label: "Hemmings",
    emoji: "📰",
    build: (m, f) => {
      const kw = f.manualOnly ? `${m.q} manual` : m.q;
      return `https://www.hemmings.com/classifieds/cars-for-sale?keywords=${enc(kw)}`;
    },
  },
];

const selected = new Set();

function getFilters() {
  return {
    zip: document.getElementById("zip").value.trim(),
    radius: document.getElementById("radius").value,
    maxPrice: document.getElementById("maxPrice").value,
    manualOnly: document.getElementById("manualOnly").checked,
  };
}

function renderModels() {
  const grid = document.getElementById("models");
  grid.innerHTML = "";
  MODELS.forEach((m) => {
    const card = document.createElement("div");
    card.className = "model-card";
    card.dataset.id = m.id;
    card.innerHTML = `
      <span class="tick">✓</span>
      <span class="emoji">${m.emoji}</span>
      <span class="name">${m.name}</span>
      <span class="sub">${m.sub}</span>
      ${m.manualBadge ? `<span class="badge">⚙️ ${m.manualBadge}</span>` : ""}`;
    card.addEventListener("click", () => {
      selected.has(m.id) ? selected.delete(m.id) : selected.add(m.id);
      card.classList.toggle("selected", selected.has(m.id));
      renderResults();
    });
    grid.appendChild(card);
  });
}

function renderResults() {
  const out = document.getElementById("results");
  out.innerHTML = "";

  if (selected.size === 0) {
    out.innerHTML = '<p class="empty">Select one or more cars to generate searches.</p>';
    return;
  }

  const f = getFilters();

  MODELS.filter((m) => selected.has(m.id)).forEach((m) => {
    const links = SITES.map((s) => ({ s, url: s.build(m, f) }));

    const group = document.createElement("div");
    group.className = "result-group";

    const head = document.createElement("div");
    head.className = "result-head";
    const ry = yearRange(m, f);
    head.innerHTML = `<span class="title"><span class="emoji">${m.emoji}</span>${m.name}
      <span class="muted small">${ry.min}–${ry.max}${f.manualOnly ? " · manual" : ""}</span></span>`;

    const openAll = document.createElement("button");
    openAll.className = "btn";
    openAll.textContent = `Open all (${links.length})`;
    openAll.addEventListener("click", () => {
      links.forEach(({ url }) => window.open(url, "_blank", "noopener"));
    });
    head.appendChild(openAll);
    group.appendChild(head);

    const list = document.createElement("div");
    list.className = "links";
    links.forEach(({ s, url }) => {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      a.innerHTML = `<span class="site-emoji">${s.emoji}</span>
        <span>${s.label}${s.note ? `<br><span class="muted small">${s.note}</span>` : ""}</span>
        <span class="arrow">↗</span>`;
      list.appendChild(a);
    });
    group.appendChild(list);
    out.appendChild(group);
  });
}

// Re-render links whenever a filter changes so URLs stay in sync.
["zip", "radius", "maxPrice", "manualOnly"].forEach((id) => {
  document.getElementById(id).addEventListener("input", renderResults);
  document.getElementById(id).addEventListener("change", renderResults);
});

renderModels();
renderResults();
