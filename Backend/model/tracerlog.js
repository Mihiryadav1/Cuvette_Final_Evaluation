import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  traceId: { type: String, required: true },
  timeStamp: { type: Date, required: true },
  apiName: { type: String, required: true },
  method: { type: String, required: true },
  apiEndpoint: { type: String, required: true },
  statusCode: { type: Number, required: true },
  responseTimeMs: { type: Number, required: true },
  logs: [
    {
      type: { type: String },
      message: String,
      timeStamp: Date,
      method: String,
      endpoint: String,
    },
  ],
});

// logSchema.index({ timeStamp: 1 }, { expireAfterSeconds: 86400 });
export default mongoose.model("TracerLog", logSchema);
