import { useRef, useEffect, useId } from "react";

/**
 * Custom dropdown (not a native select) so the open list uses theme accent highlights
 * instead of the OS blue band, which cannot be styled on native option lists.
 */
export function ThemeSelect({
  menuId,
  openMenuId,
  setOpenMenuId,
  value,
  onChange,
  options,
  accent,
  surface,
  accentTrigger = false,
  /** Tighter trigger for calendar caption (month/year between chevrons). */
  compact = false,
  "aria-label": ariaLabel,
}) {
  const open = openMenuId === menuId;
  const rootRef = useRef(null);
  const listId = useId();
  const btnId = useId();
  const m = surface;
  const a = accent;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, setOpenMenuId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpenMenuId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpenMenuId]);

  const selected = options.find((o) => o.value === value) ?? options[0];

  const triggerPad = compact ? "6px 4px" : "10px 12px";
  const triggerGap = compact ? 3 : 8;
  const triggerFont = compact ? 12 : 13;
  const chevronSize = compact ? 9 : 10;

  return (
    <div ref={rootRef} style={{ position: "relative", width: "100%", minWidth: 0 }}>
      <button
        type="button"
        id={btnId}
        className="cf-theme-select-trigger"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpenMenuId(open ? null : menuId)}
        style={{
          "--cf-ts-accent": a.color,
          width: "100%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: triggerGap,
          padding: triggerPad,
          borderRadius: compact ? 8 : 10,
          border: `1px solid ${m.cardBorder}`,
          background: m.card,
          color: accentTrigger ? a.color : m.text,
          fontSize: triggerFont,
          fontWeight: accentTrigger ? 600 : 500,
          fontFamily: "inherit",
          cursor: "pointer",
          textAlign: "left",
          boxSizing: "border-box",
          minHeight: compact ? 32 : undefined,
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selected?.label}
        </span>
        <span style={{ color: a.color, fontSize: chevronSize, flexShrink: 0 }} aria-hidden>
          ▼
        </span>
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={btnId}
          className="cf-theme-select-list"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "calc(100% + 4px)",
            zIndex: 80,
            margin: 0,
            padding: 6,
            listStyle: "none",
            maxHeight: 220,
            overflowY: "auto",
            borderRadius: 10,
            border: `1px solid ${m.cardBorder}`,
            background: m.card,
            boxShadow: "0 12px 32px rgba(15,23,42,0.12)",
          }}
        >
          {options.map((opt) => {
            const isSel = opt.value === value;
            return (
              <li key={String(opt.value)} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSel}
                  className="cf-theme-select-option"
                  data-selected={isSel ? "true" : undefined}
                  onClick={() => {
                    onChange(opt.value);
                    setOpenMenuId(null);
                  }}
                  style={{
                    "--cf-ts-accent": a.color,
                    "--cf-ts-text": m.text,
                    width: "100%",
                    display: "block",
                    padding: "8px 10px",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 13,
                    fontFamily: "inherit",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
