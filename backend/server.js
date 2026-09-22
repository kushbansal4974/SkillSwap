import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dns from "node:dns/promises";
import errorMiddleware from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.route.js";
import gigRoutes from "./routes/gig.route.js";
import bookingRoutes from "./routes/booking.route.js";
import paymentRoutes from "./routes/payment.route.js";

// Safe DNS servers configuration for MongoDB Atlas SRV resolution
try {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
} catch (dnsErr) {
  console.warn("DNS server setup notice:", dnsErr.message);
}

const app = express();

// Middlewares
app.use(
  cors({
    origin: true, // Allow frontend origin dynamically
    credentials: true,
  })
);
app.use(express.json());

// Connect Database
connectDB();

// Health Check & Root
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SkillSwap API is running",
    version: "1.0.0",
    docs: "/api/health",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes (supporting both /api and /api/v1 prefixes for seamless deployment compatibility)
app.use("/api/users", userRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/gigs", gigRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/payments", paymentRoutes);

// Error handler
app.use(errorMiddleware);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 SkillSwap Server running on port ${PORT}`);
  console.log(`📡 Healthcheck: http://localhost:${PORT}/api/health`);
});