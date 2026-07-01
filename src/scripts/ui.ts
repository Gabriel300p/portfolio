// Client-side behaviour: nav shadow, scroll reveal, language toggle,
// live clock, copy-email, and theme toggle. Progressive enhancement only —
// the page is fully readable without any of this.

type Lang = "en" | "pt";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

function initExperience() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const jobs = document.querySelectorAll<HTMLElement>(".xp");
  jobs.forEach((xp) => {
    const btn = xp.querySelector<HTMLButtonElement>(".xp-role-row");
    const panel = xp.querySelector<HTMLElement>(".xp-panel");
    if (!btn || !panel) return;

    const setOpen = (open: boolean, animate: boolean) => {
      xp.setAttribute("data-open", String(open));
      btn.setAttribute("aria-expanded", String(open));
      if (!animate || reduce) {
        panel.style.height = open ? "auto" : "0px";
        return;
      }
      if (open) {
        panel.style.height = panel.scrollHeight + "px";
        const done = () => {
          panel.style.height = "auto";
          panel.removeEventListener("transitionend", done);
        };
        panel.addEventListener("transitionend", done);
      } else {
        panel.style.height = panel.scrollHeight + "px";
        void panel.offsetHeight; // force reflow so the transition to 0 runs
        panel.style.height = "0px";
      }
    };

    // Initial state: the current role is open, the rest collapsed.
    setOpen(xp.getAttribute("data-current") === "true", false);
    btn.addEventListener("click", () => setOpen(xp.getAttribute("data-open") !== "true", true));
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

// Monochromatic binary rain in the hero (Matrix motif, in the theme's own tones).
function initHeroRain() {
  if (reduceMotion) return;
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const canvas = hero?.querySelector<HTMLCanvasElement>(".hero-rain");
  const ctx = canvas?.getContext("2d");
  if (!hero || !canvas || !ctx) return;

  const fontSize = 16;
  let cols = 0;
  let drops: number[] = [];
  let w = 0,
    h = 0,
    dpr = 1;
  let mouseX = -9999;

  // Palette per theme: bg fade for trails + faint/bright char alpha (monochrome).
  const palette = () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    return dark
      ? { bg: "22, 21, 15", fg: "240, 236, 225", fade: 0.11, faint: 0.16, bright: 0.5 }
      : { bg: "245, 244, 239", fg: "28, 26, 23", fade: 0.12, faint: 0.1, bright: 0.34 };
  };

  const resize = () => {
    const r = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width;
    h = r.height;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / fontSize);
    drops = Array.from({ length: cols }, () => Math.floor((Math.random() * h) / fontSize));
    const p = palette();
    ctx.fillStyle = `rgb(${p.bg})`;
    ctx.fillRect(0, 0, w, h);
  };

  let last = 0;
  const frame = (t: number) => {
    raf = requestAnimationFrame(frame);
    if (t - last < 45) return; // ~22fps, calm and cheap
    last = t;
    const p = palette();
    ctx.fillStyle = `rgba(${p.bg}, ${p.fade})`;
    ctx.fillRect(0, 0, w, h);
    ctx.font = `${fontSize}px "Geist Mono", ui-monospace, monospace`;
    for (let i = 0; i < cols; i++) {
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      const near = mouseX > -9999 && Math.abs(x - mouseX) < 90;
      ctx.fillStyle = `rgba(${p.fg}, ${near ? p.bright : p.faint})`;
      ctx.fillText(Math.random() < 0.5 ? "0" : "1", x, y);
      if (y > h && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  };

  let raf = 0;
  const start = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  resize();
  window.addEventListener("resize", resize);
  hero.addEventListener("pointermove", (e: PointerEvent) => {
    mouseX = e.clientX - hero.getBoundingClientRect().left;
  });
  hero.addEventListener("pointerleave", () => {
    mouseX = -9999;
  });
  // Only animate while the hero is on screen.
  new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
    threshold: 0,
  }).observe(hero);
}

// Buttons that lean toward the cursor.
function initMagnetic() {
  if (reduceMotion) return;
  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf = 0;
    const strength = 0.28;
    const max = 9;
    const clamp = (v: number) => Math.max(-max, Math.min(max, v));
    const loop = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      if (tx === 0 && ty === 0 && Math.abs(cx) < 0.1 && Math.abs(cy) < 0.1) {
        el.style.transform = "";
        raf = 0;
        return;
      }
      el.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      raf = requestAnimationFrame(loop);
    };
    el.addEventListener("pointermove", (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = clamp((e.clientX - (r.left + r.width / 2)) * strength);
      ty = clamp((e.clientY - (r.top + r.height / 2)) * strength);
      if (!raf) loop();
    });
    el.addEventListener("pointerleave", () => {
      tx = 0;
      ty = 0;
      if (!raf) loop();
    });
  });
}

// Smooth scrolling (loaded only when motion is welcome).
async function initSmoothScroll() {
  if (reduceMotion) return;
  try {
    const { default: Lenis } = await import("lenis");
    document.documentElement.style.scrollBehavior = "auto";
    const lenis = new Lenis({ duration: 1.1 });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector<HTMLElement>(id);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -70 });
        }
      });
    });
  } catch {
    /* smooth scroll is a nicety; ignore load failures */
  }
}

initNav();
initReveal();
initLang();
initClock();
initCopy();
initExperience();
initTheme();
initHeroRain();
initMagnetic();
initSmoothScroll();
