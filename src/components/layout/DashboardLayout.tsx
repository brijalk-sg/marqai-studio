import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ProjectProvider } from '../../context/ProjectContext'
import { RoleProvider } from '../../context/RoleContext'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

const COLLAPSED_KEY = 'marqai_sidebar_collapsed'

export function DashboardLayout() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem(COLLAPSED_KEY) === 'true'
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(COLLAPSED_KEY, String(collapsed))
  }, [collapsed])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <RoleProvider>
      <ProjectProvider>
        <div
          style={{
            display: 'flex',
            height: '100vh',
            background: '#0a0e1a',
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            color: '#e2e8f0',
            overflow: 'hidden',
          }}
        >
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            <TopBar onMenuClick={() => setMobileOpen(true)} />
            <main style={{ flex: 1, overflowY: 'auto', padding: '18px 22px 40px' }}>
              <Outlet />
            </main>
          </div>
        </div>
      </ProjectProvider>
    </RoleProvider>
  )
}
