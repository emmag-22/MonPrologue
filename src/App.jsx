import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import SeekerShell from './pages/SeekerShell'
import SeekerWelcome from './pages/SeekerWelcome'
import SeekerClinicSelect from './pages/seeker/SeekerClinicSelect'
import PinDisplay from './pages/seeker/PinDisplay'
import InterviewPhase0 from './pages/seeker/InterviewPhase0'
import InterviewPhase1 from './pages/seeker/InterviewPhase1'
import InterviewPhase2 from './pages/seeker/InterviewPhase2'
import InterviewPhase3 from './pages/seeker/InterviewPhase3'
import SeekerReport from './pages/seeker/SeekerReport'
import SeekerReview from './pages/seeker/SeekerReview'
import SeekerContact from './pages/seeker/SeekerContact'
import ClinicShell from './pages/ClinicShell'
import ClinicLogin from './pages/ClinicLogin'
import ClinicDashboard from './pages/ClinicDashboard'
import CaseDossier from './pages/CaseDossier'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/seeker" element={<SeekerShell />}>
        <Route index element={<SeekerWelcome />} />
        <Route path="clinic-select" element={<SeekerClinicSelect />} />
        <Route path="pin" element={<PinDisplay />} />
        <Route path="interview/0" element={<InterviewPhase0 />} />
        <Route path="interview/1" element={<InterviewPhase1 />} />
        <Route path="interview/2" element={<InterviewPhase2 />} />
        <Route path="interview/3" element={<InterviewPhase3 />} />
        <Route path="report" element={<SeekerReport />} />
        <Route path="review" element={<SeekerReview />} />
        <Route path="contact" element={<SeekerContact />} />
      </Route>
      <Route path="/clinic" element={<ClinicShell />}>
        <Route index element={<ClinicLogin />} />
        <Route path="dashboard" element={<ClinicDashboard />} />
        <Route path="case/:id" element={<CaseDossier />} />
      </Route>
    </Routes>
  )
}
