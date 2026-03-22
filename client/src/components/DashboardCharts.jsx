import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PIE_COLORS = {
  Draft: "#94a3b8",
  Sent: "#38bdf8",
  Paid: "#34d399",
  Overdue: "#fb923c",
};

const DashboardCharts = ({ revenueSeries, invoiceStatusMix, m, a, loading }) => {
  if (loading) return null;

  const lineData =
    revenueSeries?.map((row) => ({
      ...row,
      short: row.date.slice(5),
    })) ?? [];

  const pieData = invoiceStatusMix
    ? Object.entries(invoiceStatusMix)
        .filter(([, v]) => v > 0)
        .map(([name, value]) => ({ name, value }))
    : [];

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 14,
    marginBottom: 24,
  };

  const card = {
    background: m.card,
    borderRadius: 14,
    border: `1px solid ${m.cardBorder}`,
    padding: "16px 14px 12px",
    boxShadow: m.shadow,
    minHeight: 260,
  };

  const title = {
    fontFamily: "'Syne', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    color: m.textMuted,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    marginBottom: 10,
  };

  const tickStyle = { fill: m.textMuted, fontSize: 10 };
  const tooltipStyle = {
    background: m.card,
    border: `1px solid ${m.cardBorder}`,
    borderRadius: 8,
    color: m.text,
  };

  return (
    <div style={grid}>
      <div style={card}>
        <div style={title}>Paid revenue (daily)</div>
        {lineData.length === 0 ? (
          <div style={{ fontSize: 12, color: m.textMuted, padding: 24 }}>
            No paid invoices in this range.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={lineData} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={m.cardBorder} opacity={0.6} />
              <XAxis dataKey="short" tick={tickStyle} tickLine={false} axisLine={{ stroke: m.cardBorder }} />
              <YAxis tick={tickStyle} tickLine={false} axisLine={false} width={44} tickFormatter={(v) => (v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`)} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                labelFormatter={(_label, payload) =>
                  (payload?.[0]?.payload?.date ? String(payload[0].payload.date) : "")
                }
              />
              <Line type="monotone" dataKey="revenue" stroke={a.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={card}>
        <div style={title}>Invoices by status</div>
        {pieData.length === 0 ? (
          <div style={{ fontSize: 12, color: m.textMuted, padding: 24 }}>
            No invoices created in this range.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={2}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={PIE_COLORS[entry.name] || a.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, "Count"]} />
            </PieChart>
          </ResponsiveContainer>
        )}
        {pieData.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 4 }}>
            {pieData.map((d) => (
              <span key={d.name} style={{ fontSize: 10, color: m.textMuted }}>
                <span style={{ color: PIE_COLORS[d.name] || a.color, marginRight: 4 }}>●</span>
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCharts;
