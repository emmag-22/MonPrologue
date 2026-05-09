import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import SeekerShell from './pages/SeekerShell'
import SeekerWelcome from './pages/SeekerWelcome'
import PinDisplay from './pages/seeker/PinDisplay'
import InterviewPhase1 from './pages/seeker/InterviewPhase1'
import ClinicShell from './pages/ClinicShell'
import ClinicLogin from './pages/ClinicLogin'
import ClinicDashboard from './pages/ClinicDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/seeker" element={<SeekerShell />}>
        <Route index element={<SeekerWelcome />} />
        <Route path="pin" element={<PinDisplay />} />
        <Route path="interview/1" element={<InterviewPhase1 />} />
        {/* TODO: interview/2 (AI follow-ups), report, share */}
      </Route>
      <Route path="/clinic" element={<ClinicShell />}>
        <Route index element={<ClinicLogin />} />
        <Route path="dashboard" element={<ClinicDashboard />} />
        {/* TODO: case/:id dossier view */}
      </Route>
    </Routes>
  )
}
