const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db.js");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/projects", require("./routes/project.routes"));
app.use("/api/invoices", require("./routes/invoice.routes"));
app.use("/api/clients", require("./routes/client.routes"));
app.use("/api/messages", require("./routes/message.routes"));
app.use("/api/files", require("./routes/file.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Socket.io
io.on("connection", (socket) => {
  socket.on("join_project", (projectId) => {
    socket.join(projectId);
  });

  socket.on("send_message", (data) => {
    io.to(data.projectId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));