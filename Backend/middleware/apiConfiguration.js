// Controller to check if API is enabled based on configuration
import { getConfigForApi } from "../Utils/configUtils.js";

//Enable Check
export const apiEnableCheck = async (req, res, next) => {
  const config = await getConfigForApi(req.originalUrl);
  try {
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
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

 