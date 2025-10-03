// Controller for managing API configuration changes
import ApiConfig from "../model/apiConfigSchema.js";

export const updateApiConfig = async (req, res) => {
  try {
    const { apiName, key, value } = req.body;

    // Validate input
    if (!apiName || !key) {
      return res
        .status(400)
        .json({ error: "Missing required fields: api, key" });
    }

    // chech for scheduleWindow
    if (key === "scheduleWindow") {
      if (!value.startTime || !value.endTime) {
        return res
          .status(400)
          .json({ error: "Missing required fields: startTime, endTime" });
      }
      // Validate time format (HH:MM)
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(value.startTime) || !timeRegex.test(value.endTime)) {
        return res.status(400).json({
          error: "Invalid time format. Use HH:MM for startTime and endTime",
        });
      }
    }
    

    // Find or Create Config
    let config = await ApiConfig.findOne({ apiName });

    // Assign dynamic key
    config[key] = value;
    await config.save();
    res.json({
      message: "API config updated successfully",
      config,
    });
  } catch (err) {
    console.error("Error in apiConfigController:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get All Configuration APIs
export const getAllApiConfigs = async (req, res) => {
  try {
    const configs = await ApiConfig.find({});
    res.status(200).json(configs);
  } catch (err) {
    console.error("Error fetching configs:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
