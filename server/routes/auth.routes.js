const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
const { protect } = require("../middleware/auth.middleware");
const Project = require("../models/project.model");
const Invoice = require("../models/invoice.model");
const Client = require("../models/client.model");

router.get("/stats", protect, async (req, res) => {
  try {
    const [projects, clients, invoices] = await Promise.all([
      Project.countDocuments({ owner: req.user._id }),
      Client.countDocuments({ owner: req.user._id }),
      Invoice.find({ owner: req.user._id }),
    ]);

    const pendingInvoices = invoices.filter(
      (inv) => inv.status === "Draft" || inv.status === "Sent"
    ).length;

    const totalRevenue = invoices
      .filter((inv) => inv.status === "Paid")
      .reduce((sum, inv) => sum + inv.total, 0);

    const recentProjects = await Project.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("name status progress");

    res.json({
      projects,
      clients,
      pendingInvoices,
      totalRevenue,
      recentProjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;