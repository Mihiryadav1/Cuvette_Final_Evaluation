import dotenv from "dotenv";
dotenv.config();

function apiKeyAuth(req, res, next) {
  // extracting apikey from request header
  const apiKey = req.header("x-api-key");

  if (!apiKey && req.method !== "GET") {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  if (apiKey !== process.env.TRACER_API_KEY && req.method !== "GET") {
    return res.status(403).json({ message: "Invalid API key" });
  }

  next();
}

export default apiKeyAuth;
