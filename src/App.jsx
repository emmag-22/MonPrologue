import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import SeekerShell from './pages/SeekerShell'
import SeekerWelcome from './pages/SeekerWelcome'
import ClinicShell from './pages/ClinicShell'
import ClinicLogin from './pages/ClinicLogin'
import ClinicDashboard from './pages/ClinicDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/seeker" element={<SeekerShell />}>
        <Route index element={<SeekerWelcome />} />
        {/* TODO: Phase 1 interview question routes */}
      </Route>
      <Route path="/clinic" element={<ClinicShell />}>
        <Route index element={<ClinicLogin />} />
        <Route path="dashboard" element={<ClinicDashboard />} />
        {/* TODO: individual case view routes */}
      </Route>
    </Routes>
  )
}
