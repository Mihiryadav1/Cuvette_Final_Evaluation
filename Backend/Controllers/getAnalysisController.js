//Controller for Charts and Stats
import TracerLog from "../model/tracerlog.js";
export const getAnalysisStats = async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to || isNaN(Date.parse(from)) || isNaN(Date.parse(to))) {
    return res.status(400).json({ message: "Invalid date range" });
  }

  try {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    const logs = await TracerLog.find({
      timeStamp: {
        $gte: new Date(from),
        $lte: toDate,
      },
    });

    // Stats Calculations
    const totalRequests = logs.length;
    const totalResponseTime = logs.reduce((sum, log) => {
      return sum + (log.responseTimeMs || 0);
    }, 0);
    const averageResponseTime = totalRequests
      ? Math.round(totalResponseTime / totalRequests)
      : 0;
    //prerequisite calculations
    const successLogs = logs.filter((log) => log.statusCode < 400);
    const errorLogs = logs.filter((log) => log.statusCode >= 400);

    //Uptime percentage
    const upTimePercentage =
      totalRequests > 0
        ? ((successLogs.length / totalRequests) * 100).toFixed(1)
        : "0.0";

    //Error Rate
    const errorRate =
      totalRequests > 0
        ? ((errorLogs.length / totalRequests) * 100).toFixed(1)
        : "0.0";

    //Preparing response
    res.status(200).json({
      message: "Success",
      totalRequests,
      averageResponseTime,
      errorRate,
      upTimePercentage,
    });
    console.info("Total:", totalRequests);
    console.info("Errors:", errorLogs.length);
    console.info("Success:", successLogs.length);
  } catch (error) {
    console.error("Error in getAnalysisStats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUptimeOverTime = async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to || isNaN(Date.parse(from)) || isNaN(Date.parse(to))) {
    return res.status(400).json({ message: "Invalid date range" });
  }

  try {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    const logs = await TracerLog.find({
      timeStamp: {
        $gte: new Date(from),
        $lte: toDate,
      },
    });
    const groupedByDay = {};
    logs.forEach((log) => {
      const day = log.timeStamp.toISOString().split("T")[0];
      if (!groupedByDay[day]) groupedByDay[day] = [];
      groupedByDay[day].push(log);
    });
    const uptimeData = Object.keys(groupedByDay)
      .sort() // sort by date
      .map((day) => {
        const dayLogs = groupedByDay[day];
        const total = dayLogs.length;
        const success = dayLogs.filter((l) => l.statusCode < 400).length;
        const uptimePercent = total ? ((success / total) * 100).toFixed(1) : 0;
        return {
          date: day,
          uptimePercent: Number(uptimePercent),
        };
      });

    res.status(200).json(uptimeData);
  } catch (error) {
    console.error("Error in getUptimeOverTime:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
