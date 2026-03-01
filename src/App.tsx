import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { Research } from './pages/Research/Research'
import { ContentStudio } from './pages/ContentStudio/ContentStudio'
import { VisualAssets } from './pages/VisualAssets/VisualAssets'
import { Calendar } from './pages/Calendar/Calendar'
import { Publishing } from './pages/Publishing/Publishing'
import { Approvals } from './pages/Approvals/Approvals'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/research" element={<Research />} />
          <Route path="/content-studio" element={<ContentStudio />} />
          <Route path="/visuals" element={<VisualAssets />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/publishing" element={<Publishing />} />
          <Route path="/approvals" element={<Approvals />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
