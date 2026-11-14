import { lazy, Suspense, useEffect, useState } from "react";
import Nav from "./components/Nav";
import ContactDock from "./components/ContactDock";
import Palette from "./components/Palette";
import Progress from "./components/Progress";
import Hero from "./sections/Hero";
import About from "./sections/About";
import { ProjectsBoard } from "./sections/Projects";
const ProjectPage = lazy(() => import("./sections/ProjectPage"));
import Experience from "./sections/Experience";
import Education from "./sections/Education";
import Life from "./sections/Life";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import { useRoute } from "./lib/ui";

export default function App() {
  const route = useRoute();
  const [pal, setPal] = useState(false);

  // Return to a section from a project page, then scroll to it.
  useEffect(() => {
    if (route.name !== "home") return;
    const id = location.hash.slice(1);
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }), 60);
  }, [route.name]);

  // ⌘K / Ctrl+K opens the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPal((o) => !o); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Cursor spotlight: feed pointer position to any .spot element under the cursor.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(pointer: fine)").matches) return;
    const on = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(".spot") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", on, { passive: true });
    return () => document.removeEventListener("pointermove", on);
  }, []);

  return (
    <>
      <a href="#main" className="sr-only-focusable fixed z-[70] top-2 left-1/2 btn pink" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>Skip to content</a>
      <Progress />
      <Nav onProject={route.name === "project" ? route.id : undefined} onPalette={() => setPal(true)} />
      <ContactDock />
      <Palette open={pal} onClose={() => setPal(false)} />
      {route.name === "project" ? (
        <main id="main" tabIndex={-1} className="pt-14 outline-none"><Suspense fallback={<div className="section !pt-32"><p className="mono text-[var(--ink-soft)]">loading…</p></div>}><ProjectPage id={route.id} /></Suspense></main>
      ) : (
        <>
          <Hero />
          <main id="main" tabIndex={-1} className="outline-none">
            <About />
            <ProjectsBoard />
            <Experience />
            <Education />
            <Life />
            <Contact />
          </main>
        </>
      )}
      <Footer />
    </>
  );
}
