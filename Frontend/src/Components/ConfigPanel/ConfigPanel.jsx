import { memo, useEffect, useState } from "react";
import axios from "axios"
import Switch from '@mui/material/Switch';
import styles from "./ConfigPanel.module.css"
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
//Update Api Configuration

const Model = memo(({ apiName, updateConfig, config }) => {
  return (
    <div className={styles['modelContainer']}>
      <h2>Controls</h2>
      <div className={styles['model-config']}>
        <p>API: {apiName}</p>
        <Switch
          checked={config.enabled ?? false}
          onChange={(e) => {
            console.log(config, "Config")
            updateConfig(apiName, "enabled", e.target.checked);
          }}
        />
      </div>
      <div className={styles['model-config']}>
        <p>Tracer</p>
        <Switch
          checked={config.tracerEnabled ?? false}
          onChange={(e) => {
            console.log(config, "Config")
            updateConfig(apiName, "tracerEnabled", e.target.checked);
          }}
        />
      </div>
      <div className={styles['model-config']}>
        <p>schedule ON/OFF</p>
        <Switch
          checked={config.scheduleEnabled ?? false}
          onChange={(e) => {
            console.log(config, "Config")
            updateConfig(apiName, "scheduleEnabled", e.target.checked);
          }}
        />
      </div>
      <div className={styles['model-config']}>
        <p>Limit: {apiName}</p>
        <Switch
          checked={config.limitEnabled ?? false}
          onChange={(e) => {
            console.log(config, "Config")
            updateConfig(apiName, "limitEnabled", e.target.checked);
          }}
        />
      </div>
      <div className="flex">
        Number of request:
        Rate
      </div>

    </div>

  )
})
const ConfigPanel = () => {
  const [configApis, setConfigsApis] = useState([]);
  const [activeModelApi, setActiveModelApi] = useState(null);
  const updateConfig = async (api, key, value) => {
    try {
      const res = await fetch("/api/configs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-api-key": "abcd1234-ef56-7890-gh12-ijkl345678mn" },
        body: JSON.stringify({
          apiName: api,
          key: key,
          value: value
        }),
      });

      const data = await res.json();
      console.log(data, "Data");
      setConfigsApis(prev =>
        prev.map(item =>
          item.apiName === api ? { ...item, [key]: value } : item
        )
      );
    } catch (err) {
      console.error("Update failed:", err);
    }
  }


  const getApiConfig = async () => {
    await axios.get("/api/configs").then(res => {
      console.log(res)
      setConfigsApis(res.data)
    })
  }


  useEffect(() => {
    getApiConfig()
    // callFetch()
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