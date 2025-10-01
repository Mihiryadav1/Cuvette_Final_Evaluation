import Layout from './Layout/Layout'
import "./App.css"
import TraceLogs from './Components/TraceLog/TraceLogs'
import ConfigPanel from './Components/ConfigPanel/ConfigPanel'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import StatusDashboard from './Components/Dashboard/StatusDashboard'
import Home from './Components/Home/Home'
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="apitracelogs" element={<TraceLogs />} />
            <Route path="analysis" element={<StatusDashboard />} />
            <Route path="apilist" element={<ConfigPanel />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App