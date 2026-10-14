import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import scanRoutes from "./routers/scan.routes.js";
import keywordRoutes from "./routers/keyword.routes.js";
import adminRoutes from "./routers/admin.routes.js";
import supabase from "./utils/supabase.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();


const app = express();

const allowedOrigins = [
  process.env.FRONTEND_ORIGIN || "http://localhost:3000",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Dev fallback
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

const PORT = process.env.PORT || 4000;

// API Route Mounts
app.use("/api/scan", scanRoutes);
app.use("/api/keywords", keywordRoutes);
app.use("/api/admin", adminRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "NoBait Backend API",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[NoBait Server] Running on http://localhost:${PORT}`);
  console.log(`[NoBait Server] Supabase client initialized`);
});
