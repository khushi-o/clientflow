const Invoice = require("../models/invoice.model");

const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `INV-${year}-${random}`;
};

// @desc  Get all invoices
// @route GET /api/invoices
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ owner: req.user._id })
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create invoice
// @route POST /api/invoices
exports.createInvoice = async (req, res) => {
  try {
    const { clientName, clientEmail, items, tax, dueDate, notes } = req.body;

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * (tax || 0)) / 100;
    const total = subtotal + taxAmount;

    const invoice = await Invoice.create({
      invoiceNumber: generateInvoiceNumber(),
      clientName,
      clientEmail,
      items,
      subtotal,
      tax: tax || 0,
      total,
      dueDate,
      notes,
      owner: req.user._id,
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update invoice status
// @route PUT /api/invoices/:id
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!invoice)
      return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete invoice
// @route DELETE /api/invoices/:id
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!invoice)
      return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};