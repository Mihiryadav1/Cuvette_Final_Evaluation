import ApiConfig from "../model/apiConfigSchema.js";

const defaultConfigs = [
  {
    apiName: "/api/link",
    enabled: true,
    startDate: new Date("2025-02-03"),
    tracerEnabled: false,
    limitEnabled: false,
    scheduleEnabled: false,
    scheduleWindow: {
      startTime: null,
      endTime: null,
    },
    maxRequests: 10,
    rate: 5,
    rateUnit: "minute",
    setModel: false,
  },
  {
    apiName: "/api/social",
    enabled: true,
    startDate: new Date("2025-02-03"),
    tracerEnabled: false,
    limitEnabled: false,
    scheduleEnabled: false,
    scheduleWindow: {
      startTime: null,
      endTime: null,
    },

    maxRequests: 10,
    rate: 5,
    rateUnit: "minute",
    setModel: false,
  },
  {
    apiName: "/api/data",
    enabled: true,
    startDate: new Date("2025-02-03"),
    tracerEnabled: false,
    limitEnabled: false,
    scheduleEnabled: false,
    scheduleWindow: {
      startTime: null,
      endTime: null,
    },
    maxRequests: 10,
    rate: 5,
    rateUnit: "minute",
    setModel: false,
  },
  {
    apiName: "/api/weather",
    enabled: true,
    startDate: new Date("2025-02-03"),
    tracerEnabled: false,
    limitEnabled: false,
    scheduleEnabled: false,
    scheduleWindow: {
      startTime: null,
      endTime: null,
    },
    maxRequests: 10,
    rate: 5,
    rateUnit: "minute",
    setModel: false,
  },
  {
    apiName: "/api/inventory",
    enabled: true,
    startDate: new Date("2025-02-03"),
    tracerEnabled: false,
    limitEnabled: false,
    scheduleEnabled: false,
    scheduleWindow: {
      startTime: null,
      endTime: null,
    },
    maxRequests: 10,
    rate: 5,
    rateUnit: "minute",
    setModel: false,
  },
];

export async function seedApiConfigs() {
  for (const cfg of defaultConfigs) {
    const exists = await ApiConfig.findOne({ apiName: cfg.apiName });
    if (!exists) {
      await ApiConfig.create(cfg);
      console.log(`Seeded config for ${cfg.apiName}`);
    }
  }
}
