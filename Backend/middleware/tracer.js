import crypto from "crypto";
import TracerLog from "../model/tracerlog.js";
import { getConfigForApi } from "../Utils/configUtils.js";

function traceMiddleware(req, res, next) {
  const config = getConfigForApi(req.originalUrl);
  if (!config || config.tracerEnabled !== false) {
    const start = Date.now();
    const traceId = crypto.randomUUID();
    const logBuffer = [];

    function captureLog(type, args) {
      logBuffer.push({
        type,
        message: args.join(" "),
        timeStamp: new Date().toISOString(),
        method: req.method,
        endpoint: req.originalUrl,
      });
    }

    // Store original console methods
    const originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
    };

    // Override console methods
    console.log = (...args) => {
      captureLog("log", args);
      originalConsole.log(...args);
    };
    console.info = (...args) => {
      captureLog("info", args);
      originalConsole.info(...args);
    };
    console.warn = (...args) => {
      captureLog("warn", args);
      originalConsole.warn(...args);
    };
    console.error = (...args) => {
      captureLog("error", args);
      originalConsole.error(...args);
    };

    // Listen for when response is finished
    res.on("finish", async () => {
      // Restore console
      console.log = originalConsole.log;
      console.info = originalConsole.info;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;

      // Build trace object
      const traceData = {
        traceId,
        timeStamp: new Date(start).toISOString(),
        apiName: req.path,
        apiEndpoint: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        responseTimeMs: Date.now() - start,
        logs: logBuffer,
      };
      try {
        await TracerLog.create(traceData);
        console.log("[Tracer] Trace saved to MongoDB");
      } catch (err) {
        console.error("[Tracer] Failed to save trace:", err);
      }

      // Safe logging using original console
      console.log(
        "[Tracer] TraceData Captured",
        JSON.stringify(traceData, null, 2)
      );
    });

    next();
  }
}

export default traceMiddleware;
