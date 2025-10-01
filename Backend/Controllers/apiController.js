// Controllers/apiController.js
import ApiConfig from "../model/apiConfigSchema.js";

//Update API Controller
export const updateApiConfig = async (req, res) => {
  try {
    const { apiName, key, value } = req.body;

    if (!apiName || !key) {
      return res
        .status(400)
        .json({ error: "Missing required fields: api, key" });
    }

    // find or create config
    let config = await ApiConfig.findOne({ apiName });
    // assign dynamic key
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
