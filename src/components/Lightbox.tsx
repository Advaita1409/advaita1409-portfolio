import { useEffect, useRef } from "react";

/** Click-to-enlarge image viewer on a native <dialog> (Esc / backdrop click closes, focus trapped). */
export default function Lightbox({ src, alt, onClose }: { src: string | null; alt: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (src && !d.open) d.showModal();
    if (!src && d.open) d.close();
  }, [src]);
  return (
    <dialog ref={ref} aria-label={alt} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}
      className="m-auto p-0 border-0 bg-transparent max-w-[min(56rem,94vw)] w-full backdrop:bg-black/70">
      {src && (
        <div className="relative">
          <img src={src} alt={alt} className="w-full max-h-[86vh] object-contain rounded-xl bg-[var(--surface)]" />
          <button type="button" onClick={onClose} className="btn pink absolute top-3 right-3 !min-h-9" aria-label="Close image">Close</button>
        </div>
      )}
    </dialog>
  );
}
