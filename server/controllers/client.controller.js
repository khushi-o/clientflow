const Client = require("../models/client.model");

// @desc  Get all clients
// @route GET /api/clients
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({ owner: req.user._id })
      .sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create client
// @route POST /api/clients
exports.createClient = async (req, res) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;
    const client = await Client.create({
      name, email, phone, company, status, notes,
      owner: req.user._id,
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update client
// @route PUT /api/clients/:id
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!client)
      return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete client
// @route DELETE /api/clients/:id
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!client)
      return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};