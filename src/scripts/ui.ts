// Minimal UI: copy-email and the one-time Pandora flow draw-in.

function initCopy() {
  const toast = document.getElementById("toast");
  document.querySelectorAll<HTMLButtonElement>(".copy-email").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const email = btn.dataset.email ?? "";
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        return;
      }
      if (!toast) return;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 1600);
    });
  });
}

// The diagram is visible by default; only html.reveal (set while JS runs) hides it
// until it scrolls in. The Base.astro failsafe removes that class if this never runs.
function initFlow() {
  const flows = document.querySelectorAll<HTMLElement>(".flow");
  if (!("IntersectionObserver" in window)) {
    flows.forEach((f) => f.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    },
    { threshold: 0.25 },
  );
  flows.forEach((f) => io.observe(f));
}

initCopy();
initFlow();
(window as unknown as { __uiReady: boolean }).__uiReady = true;
