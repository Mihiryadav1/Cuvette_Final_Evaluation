import { LineChart } from "@mui/x-charts";
import styles from "./StatusDashboard.module.css"
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { useState, useEffect } from 'react';
import axios from "axios";
const StatusDashboard = () => {
    const [stats, setStats] = useState({
        upTimePercent: 0,
        upTime: 0,
        avgResponseTime: 0,
        requestVolume: 0,
        errorRate: 0,
        message: ""

    })

    const [formattedData, setFormattedData] = useState([])

    // Helper function for caching
    const getCachedData = (key, expiryMinutes = 10) => {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const parsed = JSON.parse(cached);
        const now = new Date().getTime();

        if (now - parsed.timestamp > expiryMinutes * 60 * 1000) {
            // expired
            localStorage.removeItem(key);
            return null;
        }
        return parsed.data;
    };

    const setCachedData = (key, data) => {
        localStorage.setItem(key, JSON.stringify({
            data,
            timestamp: new Date().getTime(),
        }));
    };

    //Fetch Donut Stats 
    const fetchStats = async (from = '2025-01-01', to = new Date().toISOString().split("T")[0]) => {
        try {
            await fetch(`/api/analysis?from=${from}&to=${to}`, {
                headers: {
                    'x-api-key': import.meta.env.VITE_API_KEY
                }
            }).then(res => {
                return res.json()
            }).then(data => {
                // console.log(data, "ActualData")
                if (data) {
                    setStats({
                        upTimePercent: parseFloat(data.upTimePercentage),
                        upTime: parseFloat(data.upTimePercentage),
                        avgResponseTime: data.averageResponseTime,
                        requestVolume: data.totalRequests,
                        errorRate: parseFloat(data.errorRate),
                        message: data.message
                    })
                }
            })


        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    //Line Chart Stats
    const fetchLineStats = async (from = '2025-01-01', to = new Date().toISOString().split("T")[0]) => {
        try {
            await axios(`/api/uptime?from=${from}&to=${to}`, {
                headers: {
                    'x-api-key': import.meta.env.VITE_API_KEY
                }
            }).then(res => {
                // console.log(res.data, "JSON")
                const chartData = res.data.map(item => ({
                    x: new Date(item.date),
                    y: item.uptimePercent,
                }));
                // console.log(chartData, "ChartData")
                setFormattedData(chartData);
            })

        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    //Chart Custom Themes
    const theme = (arcColor) => ({
        [`& .${gaugeClasses.valueText}`]: {
            fontSize: 40,
        },
        [`& .${gaugeClasses.valueText} text`]: {
            fontWeight: 500,
            fill: "#FFFFFF",
        },
        [`& .${gaugeClasses.valueArc}`]: {
            fill: arcColor,
        },
        [`& .${gaugeClasses.referenceArc}`]: {
            fill: "#22234B",
        },
    })

    useEffect(() => {
        fetchStats()
        fetchLineStats()
    }, [])

    // useEffect(() => {
    //     console.log(stats, "Stats")
    // }, [stats])

    useEffect(() => {
        console.log(formattedData)
    }, [formattedData])
    return (
        <div className={styles['grid-dashboard']}>
            <div className={styles['card']}>
                <p className={styles["chart-title"]}>
                    Uptime (Last 7 Days)
                </p>
                <Gauge width={220}
                    height={220}
                    value={stats.upTimePercent}
                    cornerRadius="50%"
                    innerRadius="80%"
                    startAngle={-90} endAngle={90}
                    outerRadius="100%"
                    text={({ value }) => `${Math.round(value)}%`}
                    sx={() => theme("#06A089")}
                />
            </div>
            <div className={styles['card']}>
                <p className={styles["chart-title"]}>
                    Average Response Time
                </p>
                <Gauge width={220}
                    height={220}
                    value={stats.avgResponseTime}
                    cornerRadius="50%"
                    innerRadius="80%"
                    outerRadius="100%"
                    text={({ value }) => `${Math.round(value)}ms`}
                    sx={() => theme("#0075FF")} />
            </div>
            <div className={styles['card']}>
                <p className={styles["chart-title"]}>
                    Request Volume
                </p>
                <Gauge width={220}
                    height={220}
                    value={`${stats.requestVolume}`}
                    cornerRadius="50%"
                    innerRadius="80%"
                    // valueMin={10} valueMax={1000}
                    outerRadius="100%"

                    sx={() => theme("#FFF200")} />
            </div>
            <div className={styles['card']}>
                <p className={styles["chart-title"]}>
                    Error Rate
                </p>
                <Gauge width={220}
                    height={220}
                    value={stats.errorRate}
                    cornerRadius="50%"
                    innerRadius="80%"
                    text={({ value }) => `${Math.round(value)}%`}
                    outerRadius="100%"
                    sx={() => theme("#720000")} />
            </div>
            <div className={styles['card']}>

                <LineChart
                    width={1100}
                    height={300}
                    dataset={formattedData}
                    series={[{
                        dataKey: "y",
                        label: "Uptime %",
                        color: "#fff",
                        lineType: "monotone",
                        thickness: 3,
                        valueFormatter: (value) => `${value.toFixed(2)}%`,
                    }]}
                    xAxis={[{
                        dataKey: "x",
                        scaleType: "time",
                        valueFormatter: d => d.toLocaleDateString(),
                        label: "Date"
                    }]}
                    yAxis={[{
                        min: 60,
                        max: 100,
                        label: "Uptime (%)"
                    }]}
                    margin={{ top: 20, bottom: 40, left: 60, right: 20 }}
                />


            </div>
        </div>
    )
}

export default StatusDashboard