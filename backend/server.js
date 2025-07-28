import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
// import path from "path";
// import { fileURLToPath } from "url";

// Routes
import brandRoutes from "./routes/brandRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Config
dotenv.config();
const app = express();

// CORS (allow multiple origins)
const allowedOrigins = [
  process.env.CLIENT_URL,       
  "http://localhost:5173"      
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middlewares
app.use(express.json());

// Health check
app.get("/ping", (req, res) => res.send("pong"));
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "🚀 واجهة برمجة التطبيقات تعمل بشكل جيد",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);

// -------------------- Serve Frontend in Production -------------------- //
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// if (process.env.NODE_ENV === "production") {
//   const distPath = path.join(__dirname, "../frontend/dist");
//   app.use(express.static(distPath));

//   app.get("/", (req, res) => {
//     res.sendFile(path.resolve(distPath, "index.html"));
//   });
// }
// ---------------------------------------------------------------------- //

// Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
  });
});
