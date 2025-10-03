import { memo, useEffect, useState } from "react"
import styles from "./Home.module.css"
import axios from "axios";
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
//API Row Component
const ApiComponent = memo(({ currentMonth, name, apiStatusMap, isLastStatusHealthy, getStatusColor }) => {
  const [filteredLogs, setFilteredLogs] = useState([])

  const getFilteredLogs = (logs, month) => {
    const targetMonth = format(month, 'yyyy-MM');
    return logs.filter(log => {
      if (!log.timeStamp) return false;
      const parsedDate = new Date(log.timeStamp);
      if (isNaN(parsedDate)) return false;
      const logMonth = format(parsedDate, 'yyyy-MM');
      return logMonth === targetMonth;
    });
  };
  useEffect(() => {
    const logs = apiStatusMap[name] || [];
    const filtered = getFilteredLogs(logs, currentMonth);
    setFilteredLogs(filtered);
  }, [currentMonth, apiStatusMap[name]]);
  return (
    // apiStatusMap[name].length ? (<div className={styles["container"]}>
    filteredLogs.length ? (<div className={styles["container"]}>
      <span>Api - {name.slice(3)}</span>
      <div className={styles['api-flex']}>
        <div className={styles["api-row"]}>
          {/* {apiStatusMap[`${name}`].map((param, index) => { */}
          {filteredLogs.map((param, index) => {
            return (<div key={index}>
              <p
                className={`${styles["api-block"]} ${styles[getStatusColor(param.statusCode)]}`}
              > </p>
            </div>)
          })}
        </div>
        <div className={styles["status-indicator"]}>
          {isLastStatusHealthy(apiStatusMap[`${name}`])
            ? <span className={styles["tick"]}>✅</span>
            : <span className={styles["cross"]}>❌</span>}
        </div>
      </div>
    </div>) : <></>
  )

})

//Month Selector
const MonthSelector = memo(({ currentMonth, setCurrentMonth }) => {
  return (
    <div className={styles["month-nav"]}>
      <button className={styles['nav-btn']} onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
        <IoIosArrowDropleftCircle />
      </button>
      <span className={styles['date']}>{format(currentMonth, "MMMM yyyy")}</span>
      <button className={styles['nav-btn']} onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
        <IoIosArrowDroprightCircle />
      </button>
    </div>

  )
})

const Home = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [apiStatusMap, setApiStatusMap] = useState({
    apiSocial: [],
    apiLink: [],
    apiData: [],
    apiWeather: [],
    apiInventory: [],
  });

  //Function to color block based on status code
  const getStatusColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return "green";
    if (statusCode >= 300 && statusCode < 400) return "orange";
    if (statusCode >= 400 && statusCode < 600) return "red";
    if (statusCode >= 100 && statusCode < 200) return "yellow";
    return "bg-gray-500";
  };

  //Check Api Health Icon- Cross or Tick
  const isLastStatusHealthy = (logs) => {
    if (!logs.length) return false;
    const lastStatus = logs[logs.length - 1].statusCode;
    return getStatusColor(lastStatus) === "green";
  }

  // Fetching API details
  const apiStatus = async () => {
    await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tracelog`, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_KEY
      }
    }).then(res => {
      const updatedMap = {
        apiSocial: [],
        apiLink: [],
        apiData: [],
        apiWeather: [],
        apiInventory: [],
      };
      const apiData = res.data;
      apiData.forEach(log => {
        const endpoint = log.apiEndpoint.toLowerCase();
        if (endpoint.includes('/api/social')) updatedMap.apiSocial.push(log);
        else if (endpoint.includes("/api/link")) updatedMap.apiLink.push(log);
        else if (endpoint.includes("/api/data")) updatedMap.apiData.push(log);
        else if (endpoint.includes("/api/weather")) updatedMap.apiWeather.push(log);
        else if (endpoint.includes("/api/inventory")) updatedMap.apiInventory.push(log)
      })
      setApiStatusMap(updatedMap);
      console.log(updatedMap)
    }).catch(err => {
      console.log("Axios Error", err)
    })
  }


  useEffect(
    () => {
      apiStatus()
      // const interval = setInterval(apiStatus, 5000);
      // return () => clearInterval(interval);
    }, [])
  return (
    <div className={styles["api-Dashboard"]}>
      {/* Month Selector */}
      <div className={styles["date-selector"]}>
        <span>System Status</span>   <MonthSelector currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
      </div>

      {/* API Status Blocks */}
      <ApiComponent currentMonth={currentMonth} name={"apiSocial"} apiStatusMap={apiStatusMap} isLastStatusHealthy={isLastStatusHealthy} getStatusColor={getStatusColor} />
      <ApiComponent currentMonth={currentMonth} name={"apiLink"} apiStatusMap={apiStatusMap} isLastStatusHealthy={isLastStatusHealthy} getStatusColor={getStatusColor} />
      <ApiComponent currentMonth={currentMonth} name={"apiData"} apiStatusMap={apiStatusMap} isLastStatusHealthy={isLastStatusHealthy} getStatusColor={getStatusColor} />
      <ApiComponent currentMonth={currentMonth} name={"apiWeather"} apiStatusMap={apiStatusMap} isLastStatusHealthy={isLastStatusHealthy} getStatusColor={getStatusColor} />
      <ApiComponent currentMonth={currentMonth} name={"apiInventory"} apiStatusMap={apiStatusMap} isLastStatusHealthy={isLastStatusHealthy} getStatusColor={getStatusColor} />
    </div>
  )
}

export default Home