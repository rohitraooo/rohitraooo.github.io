import { APPS } from "./apps/apps.js?v=9";

console.log("[home] app.js v9 loaded");

const pager = document.getElementById("pager");
const dotsWrap = document.getElementById("dots");
const railWrap = document.getElementById("railApps");
const homeButton = document.getElementById("homeButton");

const FORCE_MIN_PAGES = 3;

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
      ${p === 1 ? `
      <div class="widget widget-hero" aria-label="Featured photo">
        <div class="widget-media">
          <img src="./icons/me.png" alt="Featured photo" />
        </div>
        <div class="widget-label">About Me</div>
      </div>
      <div class="projects-widget" id="projectsWidget" aria-label="Projects">
        <div class="project-stage">
          <a class="project-card slot-main" href="#" target="_blank" rel="noopener noreferrer" aria-label="Project"></a>
          <a class="project-card slot-back" href="#" target="_blank" rel="noopener noreferrer" aria-label="Project"></a>
          <a class="project-card slot-peek" href="#" target="_blank" rel="noopener noreferrer" aria-label="Project"></a>
        </div>
        <div class="project-footer">
          <div class="project-title">Projects</div>
          <div class="project-dots" id="projectDots"></div>
        </div>
      </div>
      ` : ""}
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

const PROJECTS = [
  { title: "Valorant ESports Dashboard", img: "./icons/vlr.png", url: "https://example.com" },
  { title: "Project Two", img: "./icons/project-2.jpg", url: "https://example.com" },
  { title: "Project Three", img: "./icons/project-3.jpg", url: "https://example.com" },
];

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

function renderProjectsWidget() {
  const widget = document.getElementById("projectsWidget");
  if (!widget || PROJECTS.length === 0) return;

  const cards = [
    widget.querySelector(".slot-main"),
    widget.querySelector(".slot-back"),
    widget.querySelector(".slot-peek"),
  ];
  if (cards.some(c => !c)) return;

  const dotsWrap = document.getElementById("projectDots");
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    PROJECTS.forEach((_, i) => {
      const d = document.createElement("span");
      d.className = "project-dot" + (i === 0 ? " active" : "");
      dotsWrap.appendChild(d);
    });
  }

  let index = 0;

  function setCard(card, proj) {
    card.style.backgroundImage = `url("${proj.img}")`;
    card.href = proj.url || "#";
    card.setAttribute("aria-label", proj.title || "Project");
    card.title = proj.title || "Project";
  }

  function updateAll() {
    setCard(cards[0], PROJECTS[index % PROJECTS.length]);       // main
    setCard(cards[1], PROJECTS[(index + 1) % PROJECTS.length]); // back
    setCard(cards[2], PROJECTS[(index + 2) % PROJECTS.length]); // peek
    if (dotsWrap) {
      const dots = Array.from(dotsWrap.children);
      dots.forEach((d, i) => d.classList.toggle("active", i === (index % PROJECTS.length)));
    }
  }

  updateAll();

  function rotate() {
    // back -> main, peek -> back, main -> peek
    cards.forEach((card) => {
      if (card.classList.contains("slot-main")) {
        card.classList.remove("slot-main");
        card.classList.add("slot-peek");
      } else if (card.classList.contains("slot-back")) {
        card.classList.remove("slot-back");
        card.classList.add("slot-main");
      } else if (card.classList.contains("slot-peek")) {
        card.classList.remove("slot-peek");
        card.classList.add("slot-back");
      }
    });

    index = (index + 1) % PROJECTS.length;

    // update the new peek card with the next project
    const peek = widget.querySelector(".slot-peek");
    if (peek) {
      const nextProj = PROJECTS[(index + 2) % PROJECTS.length];
      setCard(peek, nextProj);
    }

    if (dotsWrap) {
      const dots = Array.from(dotsWrap.children);
      dots.forEach((d, i) => d.classList.toggle("active", i === (index % PROJECTS.length)));
    }
  }

  setInterval(rotate, 4500);
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
renderProjectsWidget();
