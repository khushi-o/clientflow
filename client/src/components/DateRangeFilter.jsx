import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  isSameDay,
  min as minDate,
} from "date-fns";
import { motion as Motion, AnimatePresence } from "framer-motion";
import "react-day-picker/style.css";
import { ThemeSelect } from "./ThemeSelect.jsx";

const parseYmd = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const toYmd = (d) => format(d, "yyyy-MM-dd");

const PRESETS = [
  { id: "custom", label: "Custom" },
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "month", label: "This month" },
];

const presetForRange = (from, to) => {
  if (!from || !to) return "custom";
  const d7 = { from: subDays(to, 6), to };
  if (isSameDay(from, d7.from) && isSameDay(to, d7.to)) return "7d";
  const d30 = { from: subDays(to, 29), to };
  if (isSameDay(from, d30.from) && isSameDay(to, d30.to)) return "30d";
  const sm = startOfMonth(to);
  const em = minDate([endOfMonth(to), to]);
  if (isSameDay(from, sm) && isSameDay(to, em)) return "month";
  return "custom";
};

const computePresetRange = (id) => {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  let from;
  let to = new Date(today);
  if (id === "7d") from = subDays(to, 6);
  else if (id === "30d") from = subDays(to, 29);
  else if (id === "month") {
    from = startOfMonth(today);
    to = minDate([endOfMonth(today), today]);
  } else return null;
  return { from, to };
};

/** Empty caption: month/year live in the left column; keep nav height for chevrons. */
function HiddenMonthCaption(props) {
  const { calendarMonth, displayIndex, children, ...rest } = props;
  void calendarMonth;
  void displayIndex;
  void children;
  return (
    <div
      {...rest}
      className={[rest.className, "cf-daterange-hidden-caption"].filter(Boolean).join(" ")}
      aria-hidden
    />
  );
}

/** Two-pane date range popover (controls left, calendar right) + explicit Apply. */
const DateRangeFilter = ({ dateFrom, dateTo, onChange, accent, surface }) => {
  const m = surface;
  const a = accent;
  const [open, setOpen] = useState(false);
  /** Working range while popover is open; committed dates stay in parent until Apply. */
  const [draft, setDraft] = useState(null);
  const [activeField, setActiveField] = useState("start");
  /** Calendar page (synced with DayPicker); month/year UI on the left updates this. */
  const [displayMonth, setDisplayMonth] = useState(() => startOfMonth(new Date()));
  /** Only one ThemeSelect list open at a time (preset / month / year). */
  const [openMenuId, setOpenMenuId] = useState(null);
  const wrapRef = useRef(null);

  const committed = useMemo(
    () => ({ from: parseYmd(dateFrom), to: parseYmd(dateTo) }),
    [dateFrom, dateTo]
  );

  const initDraftFromProps = useCallback(() => {
    setDraft({
      from: parseYmd(dateFrom),
      to: parseYmd(dateTo),
    });
  }, [dateFrom, dateTo]);

  const openPopover = () => {
    initDraftFromProps();
    setDisplayMonth(startOfMonth(parseYmd(dateFrom)));
    setActiveField("start");
    setOpenMenuId(null);
    setOpen(true);
  };

  const closePopover = () => {
    setOpen(false);
    setDraft(null);
    setOpenMenuId(null);
  };

  useEffect(() => {
    const fn = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        closePopover();
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const selected = draft ?? committed;

  const label = useMemo(() => {
    const x = selected?.from;
    const y = selected?.to;
    if (!x || !y) return "Choose dates";
    if (isSameDay(x, y)) return format(x, "MMM d, yyyy");
    return `${format(x, "MMM d")} – ${format(y, "MMM d, yyyy")}`;
  }, [selected]);

  const presetValue = useMemo(() => {
    if (!draft?.from || !draft?.to) return "custom";
    return presetForRange(draft.from, draft.to);
  }, [draft]);

  const navBounds = useMemo(() => {
    const y = new Date().getFullYear();
    return {
      startMonth: new Date(y - 12, 0),
      endMonth: new Date(y + 4, 11),
    };
  }, []);

  const clampToNav = useCallback(
    (d) => {
      const t = startOfMonth(d).getTime();
      const lo = navBounds.startMonth.getTime();
      const hi = startOfMonth(navBounds.endMonth).getTime();
      if (t < lo) return new Date(navBounds.startMonth);
      if (t > hi) return startOfMonth(navBounds.endMonth);
      return startOfMonth(d);
    },
    [navBounds]
  );

  const monthLabels = useMemo(
    () => Array.from({ length: 12 }, (_, i) => format(new Date(2000, i, 1), "MMMM")),
    []
  );

  const yearOptions = useMemo(() => {
    const y0 = navBounds.startMonth.getFullYear();
    const y1 = navBounds.endMonth.getFullYear();
    const ys = [];
    for (let y = y0; y <= y1; y += 1) ys.push(y);
    return ys;
  }, [navBounds]);

  const presetOptions = useMemo(
    () => PRESETS.map((p) => ({ value: p.id, label: p.label })),
    []
  );

  const monthOptions = useMemo(
    () => monthLabels.map((label, i) => ({ value: i, label })),
    [monthLabels]
  );

  const yearSelectOptions = useMemo(
    () => yearOptions.map((y) => ({ value: y, label: String(y) })),
    [yearOptions]
  );

  const pickerVars = useMemo(
    () => ({
      "--rdp-accent-color": a.color,
      "--rdp-accent-background-color": `${a.color}20`,
      "--rdp-today-color": a.color,
      "--rdp-day-height": "44px",
      "--rdp-day-width": "44px",
      "--rdp-day_button-height": "42px",
      "--rdp-day_button-width": "42px",
      "--rdp-nav-height": "3rem",
      "--rdp-nav_button-width": "2.35rem",
      "--rdp-nav_button-height": "2.35rem",
      "--rdp-months-gap": "0.75rem",
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

  const rdpComponents = useMemo(
    () => ({
      MonthCaption: HiddenMonthCaption,
    }),
    []
  );

  const canApply = draft?.from && draft?.to;

  const handleApply = () => {
    if (!draft?.from || !draft?.to) return;
    onChange({ from: toYmd(draft.from), to: toYmd(draft.to) });
    closePopover();
  };

  const onPresetChange = (id) => {
    if (id === "custom") return;
    const range = computePresetRange(id);
    if (range) {
      setDraft(range);
      setDisplayMonth(startOfMonth(range.from));
    }
  };

  const onMonthChange = (monthIndex) => {
    setDisplayMonth((prev) => clampToNav(new Date(prev.getFullYear(), monthIndex, 1)));
  };

  const onYearChange = (year) => {
    setDisplayMonth((prev) => clampToNav(new Date(year, prev.getMonth(), 1)));
  };

  const fmtField = (d) => (d ? format(d, "dd/MM/yy") : "—");

  const fieldShell = (which, labelText, dateVal, isActive) => ({
    which,
    labelText,
    dateVal,
    isActive,
  });

  const startField = fieldShell(
    "start",
    "Start",
    draft?.from,
    activeField === "start"
  );
  const endField = fieldShell("end", "End", draft?.to, activeField === "end");

  return (
    <div
      ref={wrapRef}
      className="cf-daterange"
      style={{
        position: "relative",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
        padding: "12px 14px",
        background: m.card,
        borderRadius: 14,
        border: `1px solid ${m.cardBorder}`,
        boxShadow: m.shadow,
        "--cf-picker-accent": a.color,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: m.textMuted,
          letterSpacing: "0.6px",
          textTransform: "uppercase",
        }}
      >
        Reporting period
      </span>

      <div style={{ flex: 1, minWidth: 12 }} />

      <button
        type="button"
        onClick={() => {
          if (open) closePopover();
          else openPopover();
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          borderRadius: 12,
          border: `1px solid ${m.cardBorder}`,
          background: m.bg,
          color: m.text,
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: open ? `0 0 0 2px ${a.color}35` : "none",
          transition: "box-shadow 0.2s",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="5" width="18" height="16" rx="2" stroke={a.color} strokeWidth="1.6" />
          <path d="M3 9h18" stroke={a.color} strokeWidth="1.6" />
          <path d="M8 3v4M16 3v4" stroke={a.color} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        {label}
        <span style={{ fontSize: 10, color: m.textMuted, marginLeft: 2 }}>{open ? "▲" : "▼"}</span>
      </button>

      <AnimatePresence>
        {open && draft && (
          <Motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="cf-daterange-popover cf-daterange-split"
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 10px)",
              zIndex: 50,
              borderRadius: 14,
              border: `1px solid ${m.cardBorder}`,
              background: m.card,
              boxShadow: "0 20px 50px rgba(15,23,42,0.14)",
              width: "min(100vw - 24px, 760px)",
              maxWidth: "min(100vw - 24px, 760px)",
              minWidth: 0,
              overflow: "visible",
            }}
          >
            <div
              className="cf-daterange-beak"
              style={{
                borderBottom: `8px solid ${m.card}`,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
              }}
              aria-hidden
            />

            <div
              className="cf-daterange-split-inner"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
                minHeight: 420,
                minWidth: 0,
              }}
            >
              {/* Left: presets + start/end + month/year + apply */}
              <div
                className="cf-daterange-panel-left"
                style={{
                  flex: "0 0 40%",
                  minWidth: 0,
                  padding: "20px 18px 18px",
                  borderRight: `1px solid ${m.cardBorder}`,
                  background: m.bg,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  borderRadius: "14px 0 0 14px",
                  "--cf-picker-accent": a.color,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 600,
                    color: m.textMuted,
                  }}
                >
                  Select date range:
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: m.textMuted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Preset
                  </span>
                  <ThemeSelect
                    menuId="preset"
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    value={presetValue}
                    onChange={onPresetChange}
                    options={presetOptions}
                    accent={a}
                    surface={m}
                    aria-label="Preset range"
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[startField, endField].map((f) => (
                    <button
                      key={f.which}
                      type="button"
                      onClick={() => setActiveField(f.which)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 4,
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: `2px solid ${f.isActive ? a.color : m.cardBorder}`,
                        background: m.card,
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "inherit",
                        transition: "border-color 0.15s, box-shadow 0.15s",
                        boxShadow: f.isActive ? `0 0 0 1px ${a.color}22` : "none",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: a.color,
                        }}
                      >
                        {f.labelText}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: m.text }}>
                        {fmtField(f.dateVal)}
                      </span>
                    </button>
                  ))}
                </div>

                <div
                  className="cf-daterange-month-year-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: m.textMuted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Month
                    </span>
                    <ThemeSelect
                      menuId="month"
                      openMenuId={openMenuId}
                      setOpenMenuId={setOpenMenuId}
                      value={displayMonth.getMonth()}
                      onChange={onMonthChange}
                      options={monthOptions}
                      accent={a}
                      surface={m}
                      accentTrigger
                      aria-label="Month"
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: m.textMuted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Year
                    </span>
                    <ThemeSelect
                      menuId="year"
                      openMenuId={openMenuId}
                      setOpenMenuId={setOpenMenuId}
                      value={displayMonth.getFullYear()}
                      onChange={onYearChange}
                      options={yearSelectOptions}
                      accent={a}
                      surface={m}
                      accentTrigger
                      aria-label="Year"
                    />
                  </div>
                </div>

                <div style={{ flex: 1, minHeight: 8 }} />

                <button
                  type="button"
                  disabled={!canApply}
                  onClick={handleApply}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "none",
                    background: canApply ? a.color : `${m.cardBorder}`,
                    color: canApply ? "#fff" : m.textMuted,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: canApply ? "pointer" : "not-allowed",
                    fontFamily: "inherit",
                    boxShadow: canApply ? `0 8px 20px ${a.color}44` : "none",
                  }}
                >
                  Apply
                </button>
              </div>

              {/* Right: grid only — month/year controlled from left */}
              <div
                className="cf-daterange-panel-right"
                style={{
                  flex: "1 1 60%",
                  minWidth: 0,
                  padding: "18px 20px 22px",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  "--cf-picker-accent": a.color,
                  "--cf-picker-accent-soft": `${a.color}20`,
                  "--cf-picker-border": m.cardBorder,
                  "--cf-picker-surface": m.card,
                  "--cf-picker-muted": m.textMuted,
                  "--cf-picker-text": m.text,
                }}
              >
                <DayPicker
                  mode="range"
                  numberOfMonths={1}
                  captionLayout="label"
                  navLayout="around"
                  className="cf-daypicker"
                  style={dayPickerStyle}
                  components={rdpComponents}
                  month={displayMonth}
                  onMonthChange={(d) => setDisplayMonth(clampToNav(d))}
                  startMonth={navBounds.startMonth}
                  endMonth={navBounds.endMonth}
                  selected={draft}
                  onSelect={(r) => {
                    setDraft(r);
                    if (r?.from && !r?.to) setActiveField("end");
                    else if (r?.from && r?.to) setActiveField("start");
                  }}
                />
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateRangeFilter;
