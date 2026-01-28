import { APPS } from "./apps/apps.js?v=8";

const pager = document.getElementById("pager");
const dotsWrap = document.getElementById("dots");
const railWrap = document.getElementById("railApps");
const homeButton = document.getElementById("homeButton");

if (!pager) console.error("[home] Missing #pager element in index.html");
if (!dotsWrap) console.error("[home] Missing #dots element in index.html");
if (!railWrap) console.error("[home] Missing #railApps element in index.html");
if (!homeButton) console.error("[home] Missing #homeButton element in index.html");

const FORCE_MIN_PAGES = 2;

function maxPageFromApps() {
  let max = 1;
  for (const a of APPS) {
    const p = Number(a.page) || 0;
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
  b.type = "button";
  if (p === 1) b.classList.add("active");
  b.addEventListener("click", () => scrollToIndex(p - 1));
  dotsWrap.appendChild(b);
}
const dots = [...dotsWrap.querySelectorAll("button")];

function imgTag(app, cls) {
  if (!app.iconImg) return "";
  const alt = (app.label || app.id || "App").replace(/"/g, "");
  return `<img class="${cls}" src="${app.iconImg}" alt="${alt}" loading="eager" />`;
}

function openApp(app) {
  if (!app?.url) return;
  window.open(app.url, "_blank", "noopener,noreferrer");
}

function labelScale(label) {
  const text = (label || "").trim();
  const len = text.length;
  if (len <= 10) return 1;
  if (len <= 14) return 0.92;
  if (len <= 18) return 0.85;
  if (len <= 22) return 0.78;
  return 0.72;
}

function renderGridApps() {
  document.querySelectorAll(".grid").forEach(g => (g.innerHTML = ""));

  for (const app of APPS.filter(a => Number(a.page) >= 1)) {
    const p = Number(app.page) || 1;
    const grid = document.querySelector(`.grid[data-page="${p}"]`);
    if (!grid) continue;

    const el = document.createElement("div");
    el.className = "app";
    if (app.url) {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => openApp(app));
    }

    const scale = labelScale(app.label);
    el.innerHTML = `
      <div class="icon ${app.iconClass || ""}">
        ${imgTag(app, "app-img")}
      </div>
      <div class="label" style="--label-scale:${scale}">${app.label || ""}</div>
    `;
    grid.appendChild(el);
  }
}

function isRailTrue(v){
  return v === true || v === "true" || v === 1 || v === "1";
}

function renderRailApps() {
  if (!railWrap) return;

  const railApps = APPS
    .filter(a => isRailTrue(a.rail))
    .sort((a, b) => (Number(a.railOrder) || 999) - (Number(b.railOrder) || 999));

  railWrap.innerHTML = "";

  if (railApps.length === 0) {
    railWrap.innerHTML = `<div style="opacity:.85;font-size:12px;text-align:center;padding:6px;">No rail apps</div>`;
    console.warn("[home] No rail apps found. Check apps/apps.js is loading and rail: true is set.");
    return;
  }

  for (const app of railApps.slice(0, 5)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `rail-app ${app.iconClass || ""}`;
    btn.title = app.label || app.id || "App";

    if (app.iconImg) {
      const img = document.createElement("img");
      img.className = "rail-img";
      img.src = app.iconImg;
      img.alt = app.label || app.id || "App";
      img.loading = "eager";
      img.onerror = () => {
        img.remove();
        btn.textContent = (app.label || app.id || "A")[0].toUpperCase();
      };
      btn.appendChild(img);
    } else {
      btn.textContent = (app.label || app.id || "A")[0].toUpperCase();
    }

    if (app.url) {
      btn.addEventListener("click", () => openApp(app));
    }

    railWrap.appendChild(btn);
  }
}

// Pager logic
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
window.addEventListener("resize", () => pager.scrollTo({ left: currentIndex() * pager.clientWidth }));

if (homeButton) {
  homeButton.addEventListener("click", () => scrollToIndex(0));
}

// Clock
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

renderGridApps();
renderRailApps();
