import { APPS } from "./apps/apps.js";

const pager = document.getElementById("pager");
const dotsWrap = document.getElementById("dots");
const dots = Array.from(dotsWrap.querySelectorAll("button"));

function iconInnerHTML(app) {
  switch (app.glyph) {
    case "nowplaying":
      return `
        <div class="bars" aria-hidden="true">
          <span></span><span></span><span></span><span></span>
        </div>
      `;
    case "calendar":
      return `
        <div class="glyph calendar-glyph">
          <small>${app.meta?.day ?? "Tue"}</small>
          <div>${app.meta?.date ?? "1"}</div>
        </div>
      `;
    case "settings":
      return `<div class="gear"></div>`;
    case "none":
      return ``;
    default:
      return `<div class="glyph ${app.glyph}"></div>`;
  }
}

function appCard(app) {
  const el = document.createElement("div");
  el.className = "app";
  el.dataset.appId = app.id;

  el.innerHTML = `
    <div class="icon ${app.iconClass}">
      ${iconInnerHTML(app)}
    </div>
    <div class="label">${app.label}</div>
  `;
  return el;
}

function renderApps() {
  // clear grids
  document.querySelectorAll(".grid[data-page]").forEach(g => (g.innerHTML = ""));

  APPS.forEach(app => {
    const grid = document.querySelector(`.grid[data-page="${app.page}"]`);
    if (!grid) return;
    grid.appendChild(appCard(app));
  });
}

function currentPageIndex() {
  const w = pager.clientWidth;
  return Math.round(pager.scrollLeft / w);
}

function setActiveDot(i) {
  dots.forEach((b, idx) => {
    b.classList.toggle("active", idx === i);
    b.setAttribute("aria-selected", idx === i ? "true" : "false");
  });
}

function scrollToPage(i) {
  pager.scrollTo({ left: i * pager.clientWidth, behavior: "smooth" });
  setActiveDot(i);
}

// dots
dots.forEach((btn, i) => btn.addEventListener("click", () => scrollToPage(i)));

// update dot on scroll
let raf = null;
pager.addEventListener("scroll", () => {
  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => setActiveDot(currentPageIndex()));
});

// keyboard
window.addEventListener("resize", () => {
  const i = currentPageIndex();
  pager.scrollTo({ left: i * pager.clientWidth, behavior: "instant" });
});

// initial
renderApps();
