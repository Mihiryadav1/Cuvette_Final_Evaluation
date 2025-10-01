import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styles from "./TraceLogs.module.css"
const TraceLogs = () => {
  const [traceLog, setTraceLog] = useState([])
  const fetchTraceLogs = async () => {
    try {
      await fetch('/api/tracelog').then(res => res.json()).then(res => {
        console.log(res)
        setTraceLog(res)
      })
    }
    catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchTraceLogs()
  }, [])
  return (
    <div className={styles['traceLogContainer']}>
      {traceLog.map((item, index) => {
        return (<div className={styles['traceCard']} key={index}>
          <p>TraceId : {item.traceId}</p>
          <p>Request Method : {item.method}</p>
          <p>ResponseTime : {item.responseTimeMs}</p>
          <span>Status Code : </span> {item.statusCode <= 400 ? <span style={{ color: "green", fontWeight: 600 }}>{item.statusCode}</span> : <span style={{ color: "red" }}>{item.statusCode}</span>}
          <p>Endpoint : {item.apiEndpoint}</p>
          <p>TimeStamp : {item.timeStamp.split("T").join(" | ")}</p>
        </div>)
      })}
    </div>
  )
}

export default TraceLogs