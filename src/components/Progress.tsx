import { motion, useScroll, useSpring } from "framer-motion";

/** Thin scroll-progress bar under the header. */
export default function Progress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return <motion.div aria-hidden="true" className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-[var(--accent)]" style={{ scaleX: x }} />;
}
