/* eslint-disable react-refresh/only-export-components -- provider + hook + overlay */
import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import useAuthStore from "../store/authStore";
import { APP_THEMES } from "../theme";
import ThemeTransitionOverlay from "../components/ThemeTransitionOverlay.jsx";

const ThemeChangeContext = createContext(null);

export function ThemeChangeProvider({ children }) {
  const setMode = useAuthStore((s) => s.setMode);
  const setAccent = useAuthStore((s) => s.setAccent);
  const mode = useAuthStore((s) => s.mode);
  const accent = useAuthStore((s) => s.accent);

  const [pending, setPending] = useState(null);

  const requestThemeChange = useCallback(
    (modeKey, accentKey) => {
      if (mode === modeKey && accent === accentKey) return;
      setPending({ modeKey, accentKey });
    },
    [mode, accent]
  );

  const requestThemeByIndex = useCallback(
    (index) => {
      const t = APP_THEMES[index];
      if (!t) return;
      requestThemeChange(t.key, t.accentKey);
    },
    [requestThemeChange]
  );

  const finishTransition = useCallback(() => {
    setPending((p) => {
      if (!p) return null;
      setMode(p.modeKey);
      setAccent(p.accentKey);
      return null;
    });
  }, [setMode, setAccent]);

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        e.target?.isContentEditable
      ) {
        return;
      }
      if (e.ctrlKey && e.shiftKey && /^[1-4]$/.test(e.key)) {
        e.preventDefault();
        requestThemeByIndex(parseInt(e.key, 10) - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [requestThemeByIndex]);

  const value = {
    requestThemeChange,
    requestThemeByIndex,
  };

  return (
    <ThemeChangeContext.Provider value={value}>
      {children}
      <ThemeTransitionOverlay pending={pending} onReveal={finishTransition} />
    </ThemeChangeContext.Provider>
  );
}

export function useThemeChange() {
  const ctx = useContext(ThemeChangeContext);
  if (!ctx) {
    throw new Error("useThemeChange must be used within ThemeChangeProvider");
  }
  return ctx;
}
