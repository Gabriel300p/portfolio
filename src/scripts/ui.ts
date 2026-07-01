// Client-side behaviour: nav shadow, scroll reveal, language toggle,
// live clock, copy-email, and theme toggle. Progressive enhancement only —
// the page is fully readable without any of this.

type Lang = "en" | "pt";

function initNav() {
  const nav = document.getElementById("nav");
  const sentinel = document.getElementById("top-sentinel");
  if (!nav || !sentinel) return;
  new IntersectionObserver(
    ([entry]) => nav.classList.toggle("scrolled", !entry.isIntersecting),
    { threshold: 0 }
  ).observe(sentinel);
}

function initReveal() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (reduce) {
    reveals.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  reveals.forEach((el) => io.observe(el));
}

let currentLang: Lang = "en";

function applyLang(lang: Lang) {
  currentLang = lang;
  document.querySelectorAll<HTMLElement>(".i18n").forEach((el) => {
    const val = el.getAttribute(`data-${lang}`);
    if (val !== null) el.innerHTML = val;
  });
  const btn = document.getElementById("langBtn");
  if (btn) btn.innerHTML = `${lang === "en" ? "PT" : "EN"}<b> / </b>${lang === "en" ? "EN" : "PT"}`;
  document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
  try {
    localStorage.setItem("lang", lang);
  } catch {
    /* ignore */
  }
}

function initLang() {
  let saved: Lang = "en";
  try {
    const s = localStorage.getItem("lang");
    if (s === "pt" || s === "en") saved = s;
  } catch {
    /* ignore */
  }
  applyLang(saved);
  const btn = document.getElementById("langBtn");
  btn?.addEventListener("click", () => applyLang(currentLang === "en" ? "pt" : "en"));
}

function initClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tick = () => {
    try {
      clock.textContent = new Date().toLocaleTimeString("en-GB", {
        timeZone: "America/Sao_Paulo",
        hour12: false,
      });
    } catch {
      clock.textContent = "";
    }
  };
  tick();
  if (!reduce) window.setInterval(tick, 1000);
}

function initCopy() {
  const toast = document.getElementById("toast");
  let t: number | undefined;
  document.querySelectorAll<HTMLElement>(".copy-email").forEach((btn) => {
    btn.addEventListener("click", () => {
      const email = btn.getAttribute("data-email") ?? "";
      if (navigator.clipboard) navigator.clipboard.writeText(email).catch(() => {});
      if (toast) {
        toast.textContent = currentLang === "en" ? "Email copied" : "Email copiado";
        toast.classList.add("show");
        window.clearTimeout(t);
        t = window.setTimeout(() => toast.classList.remove("show"), 1800);
      }
    });
  });
}

function initTheme() {
  const btn = document.getElementById("themeBtn");
  btn?.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore */
    }
    btn.setAttribute("aria-pressed", String(next === "dark"));
  });
}

initNav();
initReveal();
initLang();
initClock();
initCopy();
initTheme();
