import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { DayPicker, useDayPicker } from "react-day-picker";
import { format, startOfMonth } from "date-fns";
import { motion as Motion, AnimatePresence } from "framer-motion";
import "react-day-picker/style.css";
import { ThemeSelect } from "./ThemeSelect.jsx";

const parseYmd = (s) => {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const toYmd = (d) => format(d, "yyyy-MM-dd");

/** Centered month + year ThemeSelects; uses DayPicker context to navigate. */
function SingleMonthCaption({
  calendarMonth,
  displayIndex,
  children,
  openMenuId,
  setOpenMenuId,
  accent,
  surface,
  ...rest
}) {
  void children;
  void displayIndex;
  const { goToMonth, dayPickerProps } = useDayPicker();
  const a = accent;
  const m = surface;

  const sm = dayPickerProps.startMonth;
  const em = dayPickerProps.endMonth;
  const startMonth = sm ?? new Date(2000, 0);
  const endMonth = em ?? new Date(2100, 11);

  const clampMonth = (d) => {
    const t = startOfMonth(d).getTime();
    const lo = startOfMonth(startMonth).getTime();
    const hi = startOfMonth(endMonth).getTime();
    if (t < lo) return new Date(startMonth);
    if (t > hi) return startOfMonth(endMonth);
    return startOfMonth(d);
  };

  const cur = calendarMonth.date;
  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        value: i,
        label: format(new Date(2000, i, 1), "MMM"),
      })),
    []
  );

  const yearSelectOptions = useMemo(() => {
    const y0 = (sm ?? new Date(2000, 0)).getFullYear();
    const y1 = (em ?? new Date(2100, 11)).getFullYear();
    const ys = [];
    for (let y = y0; y <= y1; y += 1) ys.push({ value: y, label: String(y) });
    return ys;
  }, [sm, em]);

  return (
    <div
      {...rest}
      className={[rest.className, "cf-single-date-caption"].filter(Boolean).join(" ")}
      style={{
        ...rest.style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "var(--rdp-nav-height)",
        boxSizing: "border-box",
        paddingBottom: 4,
        paddingInline: 2,
        margin: 0,
      }}
    >
      <div className="cf-single-date-caption-month">
        <ThemeSelect
          menuId="sdp-month"
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          value={cur.getMonth()}
          onChange={(monthIndex) => {
            goToMonth(clampMonth(new Date(cur.getFullYear(), monthIndex, 1)));
          }}
          options={monthOptions}
          accent={a}
          surface={m}
          accentTrigger
          compact
          aria-label="Month"
        />
      </div>
      <div className="cf-single-date-caption-year">
        <ThemeSelect
          menuId="sdp-year"
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          value={cur.getFullYear()}
          onChange={(year) => {
            goToMonth(clampMonth(new Date(year, cur.getMonth(), 1)));
          }}
          options={yearSelectOptions}
          accent={a}
          surface={m}
          accentTrigger
          compact
          aria-label="Year"
        />
      </div>
    </div>
  );
}

/**
 * Compact single-day picker: month/year are centered dropdowns in the caption row
 * (ThemeSelect = themed lists, no OS blue band).
 */
export function SingleDatePicker({
  value,
  onChange,
  accent,
  surface,
  label,
  placeholder = "Select date",
  zIndex = 160,
  disabled = false,
}) {
  const m = surface;
  const a = accent;
  const [open, setOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const fn = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setOpenMenuId(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const navBounds = useMemo(() => {
    const y = new Date().getFullYear();
    return {
      startMonth: new Date(y - 12, 0),
      endMonth: new Date(y + 4, 11),
    };
  }, []);

  const pickerVars = useMemo(
    () => ({
      "--rdp-accent-color": a.color,
      "--rdp-accent-background-color": `${a.color}20`,
      "--rdp-today-color": a.color,
      "--rdp-day-height": "38px",
      "--rdp-day-width": "38px",
      "--rdp-day_button-height": "36px",
      "--rdp-day_button-width": "36px",
      "--rdp-nav-height": "2.65rem",
      "--rdp-nav_button-width": "2rem",
      "--rdp-nav_button-height": "2rem",
      "--rdp-months-gap": "0.5rem",
    }),
    [a.color]
  );

  const dayPickerStyle = useMemo(
    () => ({
      ...pickerVars,
      color: m.text,
      fontFamily: "inherit",
    }),
    [pickerVars, m.text]
  );

  const captionFactory = useCallback(
    (props) => (
      <SingleMonthCaption
        {...props}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
        accent={a}
        surface={m}
      />
    ),
    [openMenuId, a, m]
  );

  const components = useMemo(
    () => ({
      MonthCaption: captionFactory,
    }),
    [captionFactory]
  );

  const selectedDate = value ? parseYmd(value) : undefined;
  const displayLabel = selectedDate
    ? format(selectedDate, "MMM d, yyyy")
    : placeholder;

  return (
    <div
      ref={wrapRef}
      className="cf-single-date"
      style={{
        position: "relative",
        width: "100%",
        minWidth: 0,
        "--cf-picker-accent": a.color,
      }}
    >
      {label ? (
        <span
          style={{
            display: "block",
            fontSize: 10,
            fontWeight: 600,
            color: m.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginBottom: 6,
          }}
        >
          {label}
        </span>
      ) : null}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          borderRadius: 10,
          border: `1px solid ${m.cardBorder}`,
          background: m.bg,
          color: m.text,
          fontSize: 13,
          fontWeight: 500,
          cursor: disabled ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          boxSizing: "border-box",
          opacity: disabled ? 0.65 : 1,
          boxShadow: open ? `0 0 0 2px ${a.color}35` : "none",
          transition: "box-shadow 0.2s",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="5" width="18" height="16" rx="2" stroke={a.color} strokeWidth="1.6" />
          <path d="M3 9h18" stroke={a.color} strokeWidth="1.6" />
          <path d="M8 3v4M16 3v4" stroke={a.color} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span style={{ flex: 1, textAlign: "left", color: selectedDate ? m.text : m.textMuted }}>
          {displayLabel}
        </span>
        <span style={{ fontSize: 10, color: m.textMuted }}>{open ? "▲" : "▼"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <Motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="cf-single-date-popover cf-daterange-popover"
            style={{
              position: "absolute",
              left: 0,
              top: "calc(100% + 8px)",
              zIndex,
              borderRadius: 14,
              border: `1px solid ${m.cardBorder}`,
              background: m.card,
              boxShadow: "0 20px 50px rgba(15,23,42,0.14)",
              width: "min(100vw - 24px, 320px)",
              maxWidth: "min(100vw - 24px, 320px)",
              minWidth: 0,
              overflow: "visible",
              "--cf-picker-accent": a.color,
            }}
          >
            <div
              className="cf-single-date-popover-inner"
              style={{
                padding: "10px 12px 12px",
                minWidth: 0,
              }}
            >
              <DayPicker
                key={value || "empty"}
                mode="single"
                numberOfMonths={1}
                captionLayout="label"
                navLayout="around"
                className="cf-daypicker cf-single-date-daypicker"
                style={dayPickerStyle}
                components={components}
                defaultMonth={selectedDate ?? new Date()}
                startMonth={navBounds.startMonth}
                endMonth={navBounds.endMonth}
                selected={selectedDate}
                onSelect={(d) => {
                  if (d) {
                    onChange(toYmd(d));
                    setOpen(false);
                    setOpenMenuId(null);
                  }
                }}
              />
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
