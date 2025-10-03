import { memo, useEffect, useState } from "react";
import axios from "axios"
import Switch from '@mui/material/Switch';
import styles from "./ConfigPanel.module.css"
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
//Update Api Configuration

const Model = memo(({ apiName, updateConfig, config }) => {
  const [localSchedule, setLocalSchedule] = useState({
    startTime: config.scheduleWindow?.startTime || "",
    endTime: config.scheduleWindow?.endTime || ""
  });
  const [localLimit, setLocalLimit] = useState(config.limit ?? "");
  const [localRate, setLocalRate] = useState(config.rate ?? "");
  const [localUnit, setLocalUnit] = useState(config.rateUnit ?? "minute");


  const saveConfig = () => {
    updateConfig(apiName, "limit", localLimit);
    updateConfig(apiName, "rate", localRate);
    updateConfig(apiName, "scheduleWindow", {
      startTime: localSchedule.startTime,
      endTime: localSchedule.endTime
    });
    updateConfig(apiName, "rateUnit", localUnit);
    console.log(config, "Config")
  }

  return (
    <div className={styles['modelContainer']}>
      <h2>Controls</h2>
      <div className={styles['model-config']}>
        <p>API: {apiName}</p>
        <Switch
          checked={config.enabled ?? false}
          onChange={(e) => {
            // console.log(config, "Config")
            updateConfig(apiName, "enabled", e.target.checked);
          }}
        />
      </div>
      <div className={styles['model-config']}>
        <p>Tracer</p>
        <Switch
          checked={config.tracerEnabled ?? false}
          onChange={(e) => {
            // console.log(config, "Config")
            updateConfig(apiName, "tracerEnabled", e.target.checked);
          }}
        />
      </div>
      <div className={styles['model-config']}>
        <p>Schedule On/Off</p>
        <Switch
          checked={config.scheduleEnabled ?? false}
          onChange={(e) => {
            updateConfig(apiName, "scheduleEnabled", e.target.checked);
          }}
        />
      </div>
      <div className={styles['model-config']} style={{
        ...(config.scheduleEnabled ? { display: "block" } : { display: "none" }),
      }}>
        StartTime:
        <input
          type="time"
          value={localSchedule.startTime}
          disabled={!config.scheduleEnabled}
          onChange={(e) =>
            setLocalSchedule(prev => ({ ...prev, startTime: e.target.value }))
          }
        />
        EndTime:
        <input
          type="time"
          disabled={!config.scheduleEnabled}


          value={localSchedule.endTime}
          onChange={(e) =>
            setLocalSchedule(prev => ({ ...prev, endTime: e.target.value }))
          }
        />
      </div>
      <div className={styles['model-config']}>
        <p>Limit: {apiName}</p>
        <Switch
          checked={config.limitEnabled ?? false}
          onChange={(e) => {
            // console.log(config, "Config")
            updateConfig(apiName, "limitEnabled", e.target.checked);
          }}
        />
      </div>
      {
        config.limitEnabled && <div className={styles["limit"]}>
          <div className={styles["title"]}>
            <span>
              Number of request:
            </span>
            <input
              type="number"
              value={localLimit}
              onChange={(e) => setLocalLimit(Number(e.target.value))}
            />
          </div>
          <div className={styles["title"]}>
            <span>
              Rate
            </span>
            <input
              type="number"
              value={localRate}
              onChange={(e) => setLocalRate(Number(e.target.value))}
            />
          </div>
          <select
            value={localUnit}
            onChange={(e) => setLocalUnit(e.target.value)}
          >
            <option value="second">Second</option>
            <option value="minute">Minute</option>
          </select>


        </div>
      }
      <div className={styles['saveBtn']}>
        <button
          onClick={saveConfig}
        >
          Save
        </button>

      </div>
    </div >

  )

})
const ConfigPanel = () => {
  const [configApis, setConfigsApis] = useState([]);
  const [activeModelApi, setActiveModelApi] = useState(null);

  const updateConfig = async (api, key, value) => {
    try {
      if (!api || !key || value === undefined) {
        console.error("Missing required fields: api, key, or value");
        return;
      }
      await axios(`${import.meta.env.VITE_BACKEND_URL}/api/configs`, {
        method: "PATCH",
        headers: {
          'x-api-key': import.meta.env.VITE_API_KEY,
          'Content-Type': 'application/json'
        },
        data: {
          apiName: api,
          key: key,
          value: value
        },
      }).then(res => {
        // console.log(res, 'Config')
        setConfigsApis(prev => {
          return prev.map(item =>
            item.apiName === api ? { ...item, [key]: value } : item
          )
        }
        );
      })

      // const data = await res.json();
      // console.log(data, "Data");
    } catch (err) {
      console.error("Update failed:", err);
    }
  }


  const getApiConfig = async () => {
    await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/configs`, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_KEY
      }
    }).then(res => {
      // console.log(res)
      setConfigsApis(res.data)
    })
  }


  useEffect(() => {
    getApiConfig()
    console.log(configApis, "ConfigApis")
  }, [])

  return (
    <div className={styles["configPage"]}>
      <table >
        <thead>
          <tr>
            <th>API</th>
            <th>Start Date</th>
          </tr>
        </thead>
        <tbody>
          {
            configApis.map(api => {
              return (
                <tr key={api.apiName} >
                  <td>{api.apiName}</td>
                  <td className={styles['action']}>{api.startDate.split("T")[0]}
                    <div>
                      <button onClick={() => {
                        const isAlreadyOpen = activeModelApi === api.apiName;
                        const newState = isAlreadyOpen ? null : api.apiName;
                        updateConfig(api.apiName, "setModel", !isAlreadyOpen);
                        setConfigsApis(prev =>
                          prev.map(item =>
                            item.apiName === api.apiName ? { ...item, setModel: !isAlreadyOpen } : item
                          )
                        );

                        setActiveModelApi(newState);
                      }}>
                        <PiDotsThreeOutlineVerticalFill />
                      </button>

                      {activeModelApi === api.apiName && <Model apiName={api.apiName} updateConfig={updateConfig} config={api} />}
                    </div>
                  </td>

                </tr>
              )
            })
          }
        </tbody>
      </table>

    </div>
  )
}

export default ConfigPanel