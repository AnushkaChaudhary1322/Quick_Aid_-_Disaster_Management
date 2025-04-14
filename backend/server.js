// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import connectDB from "./db.js";
// import cors from "cors";
// import { config as dotenvConfig } from "dotenv";
// import authRoutes from "./routes/authRoute.js";
// import userRoutes from "./routes/userRoute.js";
// import shelterRoutes from "./routes/shelterRoute.js";
// import volunteerRoutes from "./routes/volunteerRoute.js";
// import planRoutes from "./routes/planRoute.js";
// import incidentRoutes from "./routes/incidentRoute.js";
// import alertRoutes from "./routes/alertRoute.js";
// import postRoutes from "./routes/postRoute.js";
// import supplyRoutes from "./routes/donationRoute.js";
// import hospitalRoutes from "./routes/hospitalRoute.js";
// // import responerRoutes from "./routes/responderRoute.js";
// import moneyDonationRoutes from "./routes/moneyDonationRoute.js";

// import bodyParser from "body-parser";
// import cookieParser from "cookie-parser";
// import razorpayRoutes from "./routes/razorpayRoute.js"; 

// dotenvConfig();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", 
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // CORS for frontend with credentials
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: "Content-Type, Authorization", 
//     credentials: true, 
//   })
// );

// app.use(express.json());
// app.use(bodyParser.json());
// app.use(cookieParser());

// connectDB();

// // Register All Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/shelter", shelterRoutes);
// app.use("/api/volunteers", volunteerRoutes);
// app.use("/api/plans", planRoutes);
// app.use("/api/incident", incidentRoutes);
// app.use("/api/alerts", alertRoutes);
// app.use("/api/threads", postRoutes);
// app.use("/api/donations", supplyRoutes);
// app.use("/api/hospital", hospitalRoutes);
// // app.use("/api/responder", responerRoutes);
// app.use("/api/money-donations", moneyDonationRoutes);
// app.use("/api/razorpay", razorpayRoutes); 

// io.on("connection", (socket) => {
//   console.log("New client connected");

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./db.js";
import cors from "cors";
import { config as dotenvConfig } from "dotenv";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import shelterRoutes from "./routes/shelterRoute.js";
import volunteerRoutes from "./routes/volunteerRoute.js";
import planRoutes from "./routes/planRoute.js";
import incidentRoutes from "./routes/incidentRoute.js";
import alertRoutes from "./routes/alertRoute.js";
import postRoutes from "./routes/postRoute.js";
import supplyRoutes from "./routes/donationRoute.js";
import hospitalRoutes from "./routes/hospitalRoute.js";
// import responerRoutes from "./routes/responderRoute.js";
import moneyDonationRoutes from "./routes/moneyDonationRoute.js";
import razorpayRoutes from "./routes/razorpayRoute.js";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// ⬇️ New imports for shelter CSV preload
import { loadSheltersFromCSV } from "./utils/loadSheltersFromCSV.js";
import Shelter from "./models/Shelter.js";

dotenvConfig();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// CORS for frontend with credentials
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Register All Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/shelter", shelterRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/incident", incidentRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/threads", postRoutes);
app.use("/api/donations", supplyRoutes);
app.use("/api/hospital", hospitalRoutes);
// app.use("/api/responder", responerRoutes);
app.use("/api/money-donations", moneyDonationRoutes);
app.use("/api/razorpay", razorpayRoutes);

// ⬇️ Preload CSV if MongoDB is empty
const preloadSheltersFromCSV = async () => {
  const existingCount = await Shelter.countDocuments();
  if (existingCount === 0) {
    const shelters = await loadSheltersFromCSV();
    await Shelter.insertMany(shelters);
    console.log(`✅ ${shelters.length} shelters loaded from CSV into MongoDB`);
  } else {
    console.log("✅ Shelter data already exists, skipping CSV preload");
  }
};

// Connect to DB and start server
connectDB()
  .then(async () => {
    await preloadSheltersFromCSV(); // Load shelters from CSV if DB is empty
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));

// WebSocket connection
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
