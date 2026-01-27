import { APPS } from "./apps/apps.js";

const pager = document.getElementById("pager");
const dotsWrap = document.getElementById("dots");

const FORCE_MIN_PAGES = 2;

// ----------------------
// Page setup
// ----------------------
function maxPageFromApps() {
  let max = 1;
  for (const a of APPS) {
    const p = Number(a.page) || 1;
    if (p > max) max = p;
  }
  return max;
}

const maxPage = Math.max(maxPageFromApps(), FORCE_MIN_PAGES);

// Build pages
pager.innerHTML = "";
for (let p = 1; p <= maxPage; p++) {
  const section = document.createElement("section");
  section.className = "page";
  section.innerHTML = `
    <div class="content">
      <div class="grid" data-page="${p}"></div>
    </div>
  `;
  pager.appendChild(section);
}

// Build dots
dotsWrap.innerHTML = "";
for (let p = 1; p <= maxPage; p++) {
  const b = document.createElement("button");
  if (p === 1) b.classList.add("active");
  b.addEventListener("click", () => scrollToIndex(p - 1));
  dotsWrap.appendChild(b);
}
const dots = [...dotsWrap.querySelectorAll("button")];

// ----------------------
// Helpers
// ----------------------
function maybeBadge(app) {
  if (app.id === "messages") return `<div class="badge">1</div>`;
  return "";
}

function iconContents(app) {
  if (app.iconImg) {
    const alt = (app.label || app.id || "App").replace(/"/g, "");
    return `<img class="app-img" src="${app.iconImg}" alt="${alt}" />`;
  }
  return "";
}

// ----------------------
// Render apps
// ----------------------
function renderApps() {
  document.querySelectorAll(".grid").forEach(g => (g.innerHTML = ""));

  for (const app of APPS) {
    const p = Number(app.page) || 1;
    const grid = document.querySelector(`.grid[data-page="${p}"]`);
    if (!grid) continue;

    const el = document.createElement("div");
    el.className = "app";

    // Click → open URL (if provided)
    if (app.url) {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => {
        window.open(app.url, "_blank", "noopener,noreferrer");
      });
    }

    el.innerHTML = `
      <div class="icon ${app.iconClass || ""}">
        ${iconContents(app)}
        ${maybeBadge(app)}
      </div>
      <div class="label">${app.label || ""}</div>
    `;

    grid.appendChild(el);
  }
}

// ----------------------
// Pager logic
// ----------------------
function currentIndex() {
  const w = pager.clientWidth || 1;
  return Math.round(pager.scrollLeft / w);
}

function setActiveDot(i) {
  dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
}

function scrollToIndex(i) {
  pager.scrollTo({ left: i * pager.clientWidth, behavior: "smooth" });
  setActiveDot(i);
}

pager.addEventListener("scroll", () => setActiveDot(currentIndex()));
window.addEventListener("resize", () =>
  pager.scrollTo({ left: currentIndex() * pager.clientWidth })
);

// ----------------------
// Clock
// ----------------------
function updateClock() {
  const t = document.getElementById("time");
  if (!t) return;
  const d = new Date();
  const hh = d.getHours();
  const mm = String(d.getMinutes()).padStart(2, "0");
  t.textContent = `${hh}:${mm}`;
}
updateClock();
setInterval(updateClock, 15000);

// Init
renderApps();
