import http from "http";
import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // Import cors
import seedRouter from "./routers/seedRouters.js";
import productRouter from "./routers/productRouters.js";
import userRouter from "./routers/userRoutes.js";
import orderRouter from "./routers/orderRoutes.js";
import uploadRouter from "./routers/uploadRoutes.js";

dotenv.config();

mongoose
  .connect(
    "mongodb+srv://usamamustafa778:usama123@bootabazaar.3g1ou.mongodb.net/"
  )
  .then(() => {
    console.log("Connected to Database.");
  })
  .catch((err) => console.log(err.message));

const app = express();

// Enable CORS to allow requests from the frontend on port 3000
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.get("/api/key/paypal", async (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

app.get("/api/key/google", async (req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY || "" });
});

app.use("/api/upload", uploadRouter);
app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

// Serve frontend assets
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Start server without Socket.IO
const port = process.env.PORT || 8000;
const httpServer = http.Server(app);

httpServer.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
