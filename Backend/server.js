import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import rateLimiter from "express-rate-limit";
dotenv.config();
import traceMiddleware from "./middleware/tracer.js";
import { mongoConnect } from "./config/db.js";
import apiKeyAuth from "./middleware/apiAuth.js";
import TracerLog from "./model/tracerlog.js";
import { getPaginatedData } from "./Controllers/statusController.js";
import {
  getAnalysisStats,
  getUptimeOverTime,
} from "./Controllers/getAnalysisController.js";
import { apiEnableCheck } from "./middleware/apiConfiguration.js";
import {
  updateApiConfig,
  getAllApiConfigs,
} from "./Controllers/apiConfigUpdateController.js";
import limiter from "./middleware/rateLimiter.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//DB connection
mongoConnect();

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "..", "Frontend", "dist")));
app.use(express.json());
app.use(traceMiddleware);
app.use("/api", apiKeyAuth);

//--------------------------Routes--------------------------

// get request
// app.get("/", (req, res) => {
//   res.json({ message: "API monitoring, Backend is running" });
// });

// Quick Stats Charts - Working
app.get("/api/analysis", getAnalysisStats);

// UptimeAPI for Line Chart
app.get("/api/uptime", getUptimeOverTime);

//logsbyparams api
app.get("/api/:apiName/status", getPaginatedData);

// Logs
app.get(
  "/api/tracelog",
  async (req, res) => {
    try {
      const logs = await TracerLog.find();
      res.status(200).json(logs);
      console.info("InfoLog: traceLog");
      console.error("Errorlog: traceLog");
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch trace logs" });
    }
  },
  apiKeyAuth
);

//Test APIs
app.get("/api/social", apiEnableCheck);
app.get("/api/link", limiter, apiEnableCheck);
app.get("/api/data", apiEnableCheck);
app.get("/api/weather", apiEnableCheck);
app.get("/api/inventory", apiEnableCheck);

//Update Api Config
app.patch("/api/configs", apiKeyAuth, updateApiConfig);
app.get("/api/configs", apiKeyAuth, getAllApiConfigs);

// Serve frontend for any other route
app.get(/.*/, (req, res) => {
  console.log(__dirname, "DIR");
  res.sendFile(path.join(__dirname, "..", "Frontend", "dist", "index.html"));
});

//server listening
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
