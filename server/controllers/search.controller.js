const Client = require("../models/client.model");
const Project = require("../models/project.model");
const Invoice = require("../models/invoice.model");

exports.search = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q || q.length < 2) {
      return res.json({ clients: [], projects: [], invoices: [] });
    }

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");
    const owner = req.user._id;

    const [clients, projects, invoices] = await Promise.all([
      Client.find({
        owner,
        $or: [{ name: regex }, { email: regex }, { company: regex }],
      })
        .limit(8)
        .select("name email company")
        .lean(),
      Project.find({ owner, name: regex })
        .limit(8)
        .select("name status progress")
        .lean(),
      Invoice.find({
        owner,
        $or: [{ invoiceNumber: regex }, { clientName: regex }],
      })
        .limit(8)
        .select("invoiceNumber clientName status total")
        .lean(),
    ]);

    res.json({
      clients: clients.map((c) => ({
        id: c._id,
        title: c.name,
        subtitle: c.company || c.email || "",
        path: `/clients?clientId=${c._id}`,
      })),
      projects: projects.map((p) => ({
        id: p._id,
        title: p.name,
        subtitle: p.status,
        path: `/projects?projectId=${p._id}`,
      })),
      invoices: invoices.map((inv) => ({
        id: inv._id,
        title: inv.invoiceNumber,
        subtitle: `${inv.clientName} · ${inv.status}`,
        path: `/invoices?invoiceId=${inv._id}`,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
