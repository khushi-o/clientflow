import { useEffect, useRef, useSyncExternalStore } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../store/authStore";
import { accents, modes } from "../theme";

/**
 * “Aurora iris” — soft accent glows drift while the old palette peels away in a
 * circular reveal, exposing the next theme underneath. Global, GPU-friendly.
 */
const ThemeTransitionOverlay = ({ pending, onReveal }) => {
  const mode = useAuthStore((s) => s.mode);
  const accent = useAuthStore((s) => s.accent);
  const revealed = useRef(false);

  const reduceMotion = useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  useEffect(() => {
    if (!pending) revealed.current = false;
  }, [pending]);

  useEffect(() => {
    if (!pending || !reduceMotion) return;
    const t = window.setTimeout(() => {
      if (revealed.current) return;
      revealed.current = true;
      onReveal?.();
    }, 0);
    return () => window.clearTimeout(t);
  }, [pending, reduceMotion, onReveal]);

  const handleReveal = () => {
    if (revealed.current) return;
    revealed.current = true;
    onReveal?.();
  };

  return (
    <AnimatePresence>
      {pending && !reduceMotion && (
        <Motion.div
          key={`${pending.modeKey}-${pending.accentKey}`}
          role="presentation"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            pointerEvents: "auto",
            cursor: "progress",
            overflow: "hidden",
          }}
        >
          {/* Target palette (what you’re changing into) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: (modes[pending.modeKey] || modes.earthy).bg,
            }}
          />

          {/* Drifting color bloom between old and new accents */}
          <Motion.div
            style={{
              position: "absolute",
              inset: "-25%",
              opacity: 0.85,
              background: (() => {
                const fromA = accents[accent] || accents.earthy;
                const toA = accents[pending.accentKey] || accents.earthy;
                return `
                  radial-gradient(ellipse 50% 42% at 22% 28%, ${fromA.color}55, transparent 52%),
                  radial-gradient(ellipse 48% 48% at 78% 72%, ${toA.color}66, transparent 55%),
                  radial-gradient(ellipse 38% 38% at 48% 48%, ${fromA.accent}38, transparent 50%)
                `;
              })(),
              filter: "blur(48px)",
              willChange: "transform, opacity",
            }}
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{
              opacity: 0.9,
              scale: 1.06,
              rotate: 1,
            }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Current UI palette — shrinks away like an iris */}
          <Motion.div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(
                165deg,
                ${(modes[mode] || modes.earthy).bg} 0%,
                ${(modes[mode] || modes.earthy).card} 48%,
                ${(modes[mode] || modes.earthy).bg} 100%
              )`,
              willChange: "clip-path",
            }}
            initial={{ clipPath: "circle(125vmax at 50% 50%)" }}
            animate={{ clipPath: "circle(0% at 50% 50%)" }}
            transition={{
              duration: 0.92,
              delay: 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={handleReveal}
          />

          {/* Brief rim light as the circle tightens */}
          <Motion.div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              boxShadow: "inset 0 0 100px rgba(255,255,255,0.12)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 0] }}
            transition={{ duration: 0.65, delay: 0.2, ease: "easeInOut" }}
          />
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThemeTransitionOverlay;
