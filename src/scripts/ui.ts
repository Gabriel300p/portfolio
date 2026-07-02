// Client-side behaviour: nav shadow, scroll reveal, language toggle,
// live clock, copy-email, and theme toggle. Progressive enhancement only —
// the page is fully readable without any of this.

type Lang = "en" | "pt";

// Signal the head-script failsafe that the module executed — reveal stays armed.
(window as unknown as { __uiReady: boolean }).__uiReady = true;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initNav() {
  const nav = document.getElementById("nav");
  const sentinel = document.getElementById("top-sentinel");
  if (!nav || !sentinel) return;
  new IntersectionObserver(
    ([entry]) => nav.classList.toggle("scrolled", !entry.isIntersecting),
    { threshold: 0 }
  ).observe(sentinel);

  // mobile menu (burger only rendered <720px via CSS)
  const burger = document.getElementById("navBurger");
  const menu = document.getElementById("navMenu");
  if (!burger || !menu) return;
  const setMenu = (open: boolean) => {
    nav.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.toggleAttribute("inert", !open);
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("menu-open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("menu-open")) {
      setMenu(false);
      burger.focus();
    }
  });
}

function initReveal() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Index children of staggered groups so CSS can cascade them (--i * 60ms).
  document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
    Array.from(group.children).forEach((child, i) =>
      (child as HTMLElement).style.setProperty("--i", String(i))
    );
  });
  const reveals = document.querySelectorAll<HTMLElement>("[data-reveal], [data-stagger]");
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
  const btn = document.getElementById("langBtnLabel");
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
      panel.toggleAttribute("inert", !open); // collapsed content must not be tabbable
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

// "See more certificates" reveal — collapsed only once JS arms it, so the
// full list stays readable with JS disabled (progressive enhancement).
function initEducation() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wrap = document.querySelector<HTMLElement>(".edu-more");
  if (!wrap) return;
  const btn = wrap.querySelector<HTMLButtonElement>(".edu-more-btn");
  const panel = wrap.querySelector<HTMLElement>(".edu-more-panel");
  if (!btn || !panel) return;

  const setOpen = (open: boolean, animate: boolean) => {
    wrap.setAttribute("data-open", String(open));
    btn.setAttribute("aria-expanded", String(open));
    panel.toggleAttribute("inert", !open); // collapsed cert links must not be tabbable
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

  setOpen(false, false);
  btn.addEventListener("click", () => setOpen(wrap.getAttribute("data-open") !== "true", true));
}

function initTheme() {
  const btn = document.getElementById("themeBtn");
  btn?.setAttribute(
    "aria-pressed",
    String(document.documentElement.getAttribute("data-theme") === "dark")
  );
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

// Green binary rain revealed only under the cursor (Matrix motif on hover).
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

  // Green per theme (vibrant, matches the accent).
  const green = () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    return dark
      ? { head: "180, 255, 210", body: "69, 224, 138", fade: 0.09 }
      : { head: "20, 150, 90", body: "11, 125, 69", fade: 0.1 };
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
    ctx.clearRect(0, 0, w, h);
  };

  let last = 0;
  const frame = (t: number) => {
    raf = requestAnimationFrame(frame);
    if (t - last < 55) return; // ~18fps, calm
    last = t;
    const g = green();
    // Fade the previous frame's pixels (transparent trail, no background color).
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = `rgba(0,0,0,${g.fade})`;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
    ctx.font = `${fontSize}px "Geist Mono", ui-monospace, monospace`;
    for (let i = 0; i < cols; i++) {
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillStyle = `rgba(${Math.random() < 0.12 ? g.head : g.body}, 0.95)`;
      ctx.fillText(Math.random() < 0.5 ? "0" : "1", x, y);
      if (y > h && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  };

  let raf = 0;
  let stopTimer: number | undefined;
  const start = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    ctx.clearRect(0, 0, w, h);
  };

  resize();
  window.addEventListener("resize", resize);
  const place = (e: PointerEvent) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", `${e.clientX - r.left}px`);
    hero.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  hero.addEventListener("pointerenter", (e: PointerEvent) => {
    window.clearTimeout(stopTimer);
    place(e);
    hero.setAttribute("data-glow", "on");
    start();
  });
  hero.addEventListener("pointermove", place);
  hero.addEventListener("pointerleave", () => {
    hero.setAttribute("data-glow", "off");
    // let the mask fade out (0.45s) before stopping the loop
    stopTimer = window.setTimeout(stop, 500);
  });
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

// Auto-advancing app screens inside device mockups (prototype-flow feel).
function initWalk() {
  document.querySelectorAll<HTMLElement>("[data-walk]").forEach((el) => {
    const screens = Array.from(el.querySelectorAll<HTMLElement>(".screen"));
    if (screens.length < 2 || reduceMotion) return; // static first screen otherwise
    const interval = Number(el.getAttribute("data-interval")) || 2600;
    let idx = 0;
    let timer = 0;
    const go = () => {
      screens[idx].classList.remove("is-active");
      idx = (idx + 1) % screens.length;
      screens[idx].classList.add("is-active");
    };
    const play = () => {
      if (!timer) timer = window.setInterval(go, interval);
    };
    const pause = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = 0;
      }
    };
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", play);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", play);
    new IntersectionObserver(([e]) => (e.isIntersecting ? play() : pause()), { threshold: 0 }).observe(el);
  });
}

// Live terminal (Pandora): type commands char-by-char, reveal output lines, loop.
// The static transcript in the markup is the no-JS / reduced-motion fallback.
function initTerminal() {
  if (reduceMotion) return;
  const term = document.querySelector<HTMLElement>("[data-terminal]");
  if (!term) return;

  type Tok = [cls: string, text: string];
  interface Block {
    cmd: Tok[];
    out: Tok[][];
  }
  const program: Block[] = [
    {
      cmd: [["t-prompt", "❯ "], ["t-cmd", "pandora ingest"], ["", " "], ["t-flag", "--session"]],
      out: [
        [["t-out", "↳ routing knowledge → wiki/ · brain/ · raw/"]],
        [["t-out", "↳ 18 notes linked · 4 ADRs · 0 secrets leaked"], ["", "  "], ["t-ok", "✓"]],
      ],
    },
    {
      cmd: [["t-prompt", "❯ "], ["t-cmd", "qmd query"], ["", " "], ["t-str", '"auth session decisions"']],
      out: [
        [["t-out", "12 hits · 3 backlinks · 1 ADR · 0.91 match"]],
        [["t-out", "› reference/engineering/auth-model.md"]],
      ],
    },
    {
      cmd: [["t-prompt", "❯ "], ["t-cmd", "pandora agents"], ["", " "], ["t-flag", "scout + verify"]],
      out: [
        [["t-out", "scout  ▸ 2 opportunities found"]],
        [["t-out", "verify ▸ adversarial pass · 0 false claims"], ["", "  "], ["t-ok", "✓"]],
      ],
    },
  ];

  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  let visible = false;
  const untilVisible = () =>
    new Promise<void>((res) => {
      if (visible) return res();
      const t = window.setInterval(() => {
        if (visible) {
          window.clearInterval(t);
          res();
        }
      }, 150);
    });

  const line = () => {
    const p = document.createElement("p");
    p.className = "line";
    term.appendChild(p);
    return p;
  };
  const span = (cls: string, text: string) => {
    const s = document.createElement("span");
    if (cls) s.className = cls;
    s.textContent = text;
    return s;
  };

  async function typeCmd(p: HTMLElement, toks: Tok[]) {
    const caret = span("t-caret", "");
    p.appendChild(caret);
    for (const [cls, text] of toks) {
      if (cls === "t-prompt") {
        p.insertBefore(span(cls, text), caret);
        continue;
      }
      const s = span(cls, "");
      p.insertBefore(s, caret);
      for (const ch of text) {
        s.textContent += ch;
        p.appendChild(caret); // keep caret at the tail while typing
        await sleep(32 + Math.random() * 48);
      }
    }
    caret.remove();
  }

  async function run() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await untilVisible();
      term.textContent = "";
      for (const block of program) {
        const p = line();
        await typeCmd(p, block.cmd);
        await sleep(260);
        for (const out of block.out) {
          const op = line();
          out.forEach(([cls, text]) => op.appendChild(span(cls, text)));
          await sleep(360);
        }
        await sleep(520);
      }
      const fp = line();
      fp.appendChild(span("t-prompt", "❯ "));
      fp.appendChild(span("t-caret", ""));
      await sleep(2800);
    }
  }

  let started = false;
  new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      if (visible && !started) {
        started = true;
        run();
      }
    },
    { threshold: 0.25 }
  ).observe(term);
}

// Play muted showcase videos only while in view (never eager-download off-screen).
function initVideoGate() {
  document.querySelectorAll<HTMLVideoElement>("video[data-gate]").forEach((v) => {
    if (reduceMotion) {
      v.removeAttribute("autoplay");
      v.pause();
      return;
    }
    // Open the loop on a meaningful frame, not a mid-scroll blur (eftakher pattern).
    v.addEventListener("loadedmetadata", () => {
      if (v.currentTime < 1.5) v.currentTime = 1.5;
    });
    new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.5 }
    ).observe(v);
  });
}

// Custom cursor — crosshair dot + trailing ring (spring-lerp, ~110ms trail).
// Fine pointers only; reduced-motion keeps the native cursor untouched.
function initCursor() {
  if (reduceMotion) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const ring = document.createElement("div");
  ring.className = "cur-ring";
  const dot = document.createElement("div");
  dot.className = "cur-dot";
  ring.setAttribute("aria-hidden", "true");
  dot.setAttribute("aria-hidden", "true");
  document.body.append(ring, dot);

  let tx = -100,
    ty = -100;
  let dx = tx,
    dy = ty,
    rx = tx,
    ry = ty;
  let raf = 0;
  let armed = false;

  // lerp factors: dot snaps (~40ms), ring trails (~110ms to close 90%)
  const DOT_K = 0.55;
  const RING_K = 0.28;

  const loop = () => {
    dx += (tx - dx) * DOT_K;
    dy += (ty - dy) * DOT_K;
    rx += (tx - rx) * RING_K;
    ry += (ty - ry) * RING_K;
    dot.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) translate(-50%, -50%)`;
    if (Math.abs(tx - rx) < 0.1 && Math.abs(ty - ry) < 0.1) {
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(loop);
  };

  document.addEventListener("pointermove", (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    tx = e.clientX;
    ty = e.clientY;
    if (!armed) {
      // hide the native cursor only once the custom one is provably rendering
      armed = true;
      dx = rx = tx;
      dy = ry = ty;
      document.documentElement.classList.add("cursor-on");
    }
    if (!raf) raf = requestAnimationFrame(loop);
  });

  // states: interactive controls tighten the ring, project media expands it
  const INTERACTIVE = "a, button, summary, [role='button']";
  const MEDIA = ".panel, .shot, .browser-view, .device-screen";
  document.addEventListener("pointerover", (e: PointerEvent) => {
    const t = e.target as Element | null;
    if (!t || !(t instanceof Element)) return;
    const state = t.closest(MEDIA) ? "media" : t.closest(INTERACTIVE) ? "link" : "";
    if (state) ring.setAttribute("data-state", state);
    else ring.removeAttribute("data-state");
  });
  document.addEventListener("pointerdown", () => ring.setAttribute("data-press", ""));
  document.addEventListener("pointerup", () => ring.removeAttribute("data-press"));
  document.addEventListener("pointercancel", () => ring.removeAttribute("data-press"));

  // leaving the window hides the pair; re-entry re-shows it
  document.documentElement.addEventListener("pointerleave", () => {
    document.documentElement.classList.remove("cursor-on");
    armed = false;
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
    // Handles both "#work" and "/#work" (nav links are absolute so they also
    // work from the case-study page, where they trigger a normal navigation).
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href") ?? "";
        const hash = href.startsWith("/#") ? href.slice(1) : href;
        if (href.startsWith("/#") && window.location.pathname !== "/") return; // cross-page: navigate
        if (!hash || hash === "#") return;
        const target = document.querySelector<HTMLElement>(hash);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -70 });
          history.pushState(null, "", hash);
          // keyboard/AT focus must follow the scroll, not stay in the nav
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
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
initEducation();
initTheme();
initHeroRain();
initMagnetic();
initWalk();
initTerminal();
initVideoGate();
initCursor();
initSmoothScroll();
