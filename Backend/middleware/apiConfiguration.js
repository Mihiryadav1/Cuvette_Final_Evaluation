import { getConfigForApi } from "../Utils/configUtils.js";

//Enable Check
export async function apiEnableCheck(req, res, next) {
  const config = await getConfigForApi(req.originalUrl);
  if (!config || config.enabled === false) {
    return res.status(503).json({ message: "API disabled by configuration" });
  }
  //Start Date of API Enable
  const date = new Date();
  const startDate = new Date(config.startDate);
  if (date < startDate) {
    return res.status(403).json({ message: "API not active yet" });
  }
  res.status(200).send(`${config.apiName} success`);
  next();
}
