import Tracelog from "../model/tracerlog.js";

export const getPaginatedData = async (req, res) => {
  const { apiName } = req.params;
  const { from, to, page = 1, limit = 10 } = req.query;

  if (!apiName || !from || !to) {
    return res.status(400).json({
      message: "Missing required query parameters: apiName, fromDate, toDate",
    });
  }

  try {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    const query = {
      apiName: `/api/${apiName}/status`,
      timeStamp: {
        $gte: fromDate,
        $lte: toDate,
      },
    };

    const pageNum = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    const totalLogs = await Tracelog.countDocuments(query);

    const logs = await Tracelog.find(query)
      .sort({ timeStamp: 1 })
      .skip((pageNum - 1) * pageLimit)
      .limit(pageLimit);

    const formattedData = logs.map((log) => ({
      timestamp: log.timeStamp,
      statusCode: log.statusCode,
    }));

    res.status(200).json({
      data: formattedData,
      apiName,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalLogs / pageLimit),
        totalLogs,
      },
    });
  } catch (error) {
    console.error("Pagination error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
