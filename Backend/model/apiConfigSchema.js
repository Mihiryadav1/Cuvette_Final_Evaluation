import mongoose from "mongoose";

const apiConfigSchema = new mongoose.Schema({
  apiName: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: true },
  startDate: { type: Date, default: null },
  tracerEnabled: { type: Boolean, default: false },
  limitEnabled: { type: Boolean, default: false },
  //Scheduling
  scheduleEnabled: { type: Boolean, default: false },
  startDate: { type: Date, default: null },
  startTime: { type: String, default: null },
  endTime: { type: String, default: null },
  //Rate Limiting
  limit: { type: Number, default: null },
  rate: { type: Number, default: null },
  setModel: { type: Boolean, default: false },
});

export default mongoose.model("ApiConfig", apiConfigSchema);
