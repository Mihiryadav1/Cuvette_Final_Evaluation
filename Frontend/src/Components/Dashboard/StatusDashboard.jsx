import { LineChart } from "@mui/x-charts";
import styles from "./StatusDashboard.module.css"
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { useState, useEffect } from 'react';

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

    //Fetch Stats 
    const fetchStats = async (from = '2025-01-01', to = new Date().toISOString().split("T")[0]) => {
        try {
            await fetch(`/api/analysis?from=${from}&to=${to}`).then(res => {
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
    const fetchLineStats = async (from = '2025-01-01', to = '2025-09-23') => {
        try {
            const res = await fetch(`http://localhost:5000/api/uptime?from=${from}&to=${to}`);
            const json = await res.json();
            console.log(json, "JSON")
            const chartData = (json.data || [])
                .filter(item => item.date && item.uptimePercent != null)
                .map(item => ({
                    x: new Date(item.date),
                    y: item.uptimePercent,
                }));

            setFormattedData(chartData);
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
    useEffect(() => {
        console.log(stats, "Stats")
    }, [stats])
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
                    series={[{ dataKey: "y", label: "Uptime %" }]}
                    xAxis={[
                        { dataKey: "x", scaleType: "time", valueFormatter: d => d.toLocaleDateString() }
                    ]}
                    yAxis={[{ min: 95, max: 100, label: "Uptime (%)" }]}
                />


            </div>
        </div>
    )
}

export default StatusDashboard