/** Self-cleaning DOM confetti burst. No-op under reduced motion. */
export function confetti(count = 90) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#5EEAD4", "#FBBF24", "#A78BFA", "#FB7185", "#60A5FA"];
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:100;overflow:hidden";
  for (let i = 0; i < count; i++) {
    const el = document.createElement("i");
    const size = 6 + Math.random() * 8;
    el.style.cssText = `position:absolute;top:-20px;left:${Math.random() * 100}%;width:${size}px;height:${size * 0.6}px;background:${colors[i % colors.length]};border-radius:2px`;
    host.appendChild(el);
    el.animate(
      [
        { transform: "translate(0,0) rotate(0)", opacity: 1 },
        { transform: `translate(${(Math.random() - 0.5) * 300}px,${window.innerHeight + 40}px) rotate(${Math.random() * 900}deg)`, opacity: 0.8 },
      ],
      { duration: 1800 + Math.random() * 1400, easing: "cubic-bezier(.2,.6,.4,1)", delay: Math.random() * 300, fill: "forwards" },
    );
  }
  document.body.appendChild(host);
  setTimeout(() => host.remove(), 3800);
}
