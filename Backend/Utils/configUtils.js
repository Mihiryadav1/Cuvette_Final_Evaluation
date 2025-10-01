import ApiConfig from "../model/apiConfigSchema.js";
 
export async function getConfigForApi(endpoint) {
  const allConfigs = await ApiConfig.find({}).lean();
  // console.log(allConfigs, "All Config");
  const matchedConfig = allConfigs.find((cfg) =>
    endpoint.includes(cfg.apiName)
  );
  console.log(matchedConfig, "Store");
  return matchedConfig;

}
