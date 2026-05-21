import { APPS } from "./apps/apps.js?v=23";
import { CURRENT_WORK } from "./apps/currentWork.js?v=1";

console.log("[home] app.js v23 loaded");

const pager = document.getElementById("pager");
const dotsWrap = document.getElementById("dots");
const railWrap = document.getElementById("railApps");
const homeButton = document.getElementById("homeButton");
const lockScreen = document.getElementById("lockScreen");
const unlockControl = document.getElementById("unlockControl");
const lockButton = document.getElementById("lockButton");
const currentWorkList = document.getElementById("currentWorkList");
const lockBubbles = document.getElementById("lockBubbles");

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

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function randomInt(min, max) {
  return Math.floor(randomBetween(min, max + 1));
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function renderLockBubbles() {
  if (!lockBubbles) return;

  const themes = [
    {
      bg: "linear-gradient(145deg, rgba(190,255,236,.95), rgba(30,169,184,.88))",
      shadow: "inset -18px -18px 48px rgba(0,70,150,.28), inset 14px 14px 48px rgba(255,255,255,.42)"
    },
    {
      bg: "linear-gradient(155deg, rgba(179,218,255,.98), rgba(38,94,218,.86) 58%, rgba(9,31,107,.96))",
      shadow: "inset -18px -24px 54px rgba(3,18,70,.38), inset 10px 10px 42px rgba(255,255,255,.45)"
    },
    {
      bg: "linear-gradient(155deg, rgba(168,239,255,.9), rgba(22,165,213,.72))",
      shadow: "inset 12px 16px 40px rgba(255,255,255,.34), inset -14px -18px 40px rgba(0,55,130,.28)"
    },
    {
      bg: "linear-gradient(145deg, rgba(245,255,250,.86), rgba(111,203,255,.66))",
      shadow: "inset 14px 14px 44px rgba(255,255,255,.38), inset -16px -20px 46px rgba(18,67,142,.24)"
    }
  ];

  const count = randomInt(3, 7);
  lockBubbles.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const bubble = document.createElement("span");
    const theme = pick(themes);
    const size = randomBetween(28, 88);
    const left = randomBetween(-24, 96);
    const top = randomBetween(-24, 92);
    const driftX = randomBetween(-14, 14);
    const driftY = randomBetween(-10, 10);

    bubble.className = "lock-bubble";
    bubble.style.setProperty("--bubble-size", `min(${size}vw, ${Math.round(size * 8)}px)`);
    bubble.style.setProperty("--bubble-left", `${left}vw`);
    bubble.style.setProperty("--bubble-top", `${top}vh`);
    bubble.style.setProperty("--bubble-opacity", randomBetween(0.38, 0.86).toFixed(2));
    bubble.style.setProperty("--bubble-bg", theme.bg);
    bubble.style.setProperty("--bubble-shadow", theme.shadow);
    bubble.style.setProperty("--bubble-duration", `${randomBetween(16, 30).toFixed(1)}s`);
    bubble.style.setProperty("--bubble-delay", `${randomBetween(-10, 0).toFixed(1)}s`);
    bubble.style.setProperty("--bubble-drift-x", `${driftX.toFixed(1)}vw`);
    bubble.style.setProperty("--bubble-drift-y", `${driftY.toFixed(1)}vh`);
    bubble.style.setProperty("--bubble-drift-x-end", `${(driftX * randomBetween(1.35, 1.9)).toFixed(1)}vw`);
    bubble.style.setProperty("--bubble-drift-y-end", `${(driftY * randomBetween(1.2, 1.7)).toFixed(1)}vh`);
    bubble.style.setProperty("--bubble-scale-start", randomBetween(0.92, 1).toFixed(2));
    bubble.style.setProperty("--bubble-scale-mid", randomBetween(1.01, 1.08).toFixed(2));
    bubble.style.setProperty("--bubble-scale-end", randomBetween(0.94, 1.03).toFixed(2));

    lockBubbles.appendChild(bubble);
  }
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
  const d = new Date();
  const hh = d.getHours();
  const mm = String(d.getMinutes()).padStart(2, "0");

  const lockTime = document.getElementById("lockTime");
  const lockDate = document.getElementById("lockDate");
  if (lockTime) {
    const displayHour = hh % 12 || 12;
    lockTime.setAttribute("aria-label", `${displayHour}:${mm}`);
    lockTime.innerHTML = `<span>${displayHour}</span><span class="lock-time-colon" aria-hidden="true"></span><span>${mm}</span>`;
  }
  if (lockDate) {
    lockDate.textContent = d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  }
}

function renderCurrentWork() {
  if (!currentWorkList) return;

  currentWorkList.innerHTML = "";

  for (const item of CURRENT_WORK) {
    const element = document.createElement(item.url ? "a" : "article");
    element.className = "work-notification";

    if (item.url) {
      element.href = item.url;
      element.target = "_blank";
      element.rel = "noopener noreferrer";
    }

    const icon = item.iconImg
      ? `<img src="${escapeHtml(item.iconImg)}" alt="" aria-hidden="true" loading="eager" />`
      : `<span aria-hidden="true">${escapeHtml((item.title || "W")[0]).toUpperCase()}</span>`;

    element.innerHTML = `
      <div class="work-notification-icon">${icon}</div>
      <div class="work-notification-copy">
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.description)}</p>
      </div>
    `;

    currentWorkList.appendChild(element);
  }
}
updateClock();
setInterval(updateClock, 15000);

function unlockSite() {
  document.body.classList.remove("home-entering");
  document.body.classList.add("unlocked");
  window.requestAnimationFrame(() => {
    document.body.classList.add("home-entering");
  });
  window.setTimeout(() => {
    if (lockScreen) lockScreen.setAttribute("aria-hidden", "true");
  }, 700);
  window.setTimeout(() => {
    document.body.classList.remove("home-entering");
  }, 1400);
}

function lockSite() {
  document.body.classList.remove("unlocked", "home-entering");
  if (lockScreen) lockScreen.setAttribute("aria-hidden", "false");
}

if (unlockControl) {
  unlockControl.addEventListener("click", unlockSite);
}

if (lockButton) {
  lockButton.addEventListener("click", lockSite);
}

if (lockScreen) {
  let startY = null;

  lockScreen.addEventListener("pointerdown", (event) => {
    startY = event.clientY;
  });

  lockScreen.addEventListener("pointerup", (event) => {
    if (startY === null) return;
    const distance = startY - event.clientY;
    startY = null;
    if (distance > 70) unlockSite();
  });
}

renderGridApps();
renderRailApps();
renderProjectsWidget();
renderCurrentWork();
renderLockBubbles();
