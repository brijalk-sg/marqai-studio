import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { Home } from './pages/Home/Home'
// import LoginPage from './pages/LoginPage'
// import SignupPage from './pages/SignupPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} /> */}

        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
