/**
 * Comma-separated list in CLIENT_ORIGIN, e.g. https://app.example.com,http://localhost:5173
 */
function getCorsOrigins() {
  const raw = process.env.CLIENT_ORIGIN;
  if (raw && raw.trim()) {
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return ["http://localhost:5173", "http://127.0.0.1:5173"];
}

module.exports = { getCorsOrigins };
