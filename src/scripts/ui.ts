// Minimal UI: copy-email and the one-time Pandora flow draw-in.

function initCopy() {
  const toast = document.getElementById("toast");
  let timer: number | undefined;
  const show = (msg: string) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(timer);
    timer = window.setTimeout(() => toast.classList.remove("show"), 1600);
  };
  document.querySelectorAll<HTMLButtonElement>(".copy-email").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const email = btn.dataset.email ?? "";
      try {
        await navigator.clipboard.writeText(email);
        show("Copied");
      } catch {
        show("Copy failed. Use the email link.");
      }
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
