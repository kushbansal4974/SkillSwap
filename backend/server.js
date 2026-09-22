import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dns from "node:dns/promises";
import errorMiddleware from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.route.js";
import gigRoutes from "./routes/gig.route.js";
import bookingRoutes from "./routes/booking.route.js";

// Safe DNS servers configuration for MongoDB Atlas SRV resolution
try {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
} catch (dnsErr) {
  console.warn("DNS server setup notice:", dnsErr.message);
}

process.on("unhandledRejection", (reason) => {
  console.error("⚠️ Unhandled Rejection in Server:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("⚠️ Uncaught Exception in Server:", err);
});


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

app.get(["/health", "/api/health"], (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Core Brief Routes (supporting root, /api, and /api/v1 prefixes)
app.use("/api/users", userRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bookings", bookingRoutes);

app.use("/users", userRoutes);
app.use("/gigs", gigRoutes);
app.use("/bookings", bookingRoutes);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/gigs", gigRoutes);
app.use("/api/v1/bookings", bookingRoutes);


// Error handler
app.use(errorMiddleware);

// Server (standalone mode)
const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 SkillSwap Server running on port ${PORT}`);
    console.log(`📡 Healthcheck: http://localhost:${PORT}/api/health`);
  });
}

export default app;